import asyncio
from typing import Dict, Optional
from datetime import datetime
import uuid
import logging
from app.database import get_supabase
from app.services.apify_service import apify_service
from app.services.parser_service import parse_quill_comments
from app.services.embeddings_service import embeddings_service
from app.services.pinecone_service import pinecone_service
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


class JobManager:
    def __init__(self):
        # In-memory storage for active jobs
        self.jobs: Dict[str, Dict] = {}
    
    def create_job(self, job_id: str, url: str):
        """Create a new job tracking entry."""
        self.jobs[job_id] = {
            "status": "PROCESSING",
            "embeddings_progress": 0,
            "gemini_progress": 0,
            "estimated_time_remaining": None,
            "error": None,
            "analysis_id": None
        }
        logger.info(f"Created job {job_id} for URL: {url}")
    
    def update_embeddings_progress(self, job_id: str, progress: int):
        """Update embeddings progress for a job."""
        if job_id in self.jobs:
            self.jobs[job_id]["embeddings_progress"] = progress
            logger.info(f"Job {job_id} embeddings progress: {progress}%")
    
    def update_gemini_progress(self, job_id: str, progress: int):
        """Update Gemini analysis progress for a job."""
        if job_id in self.jobs:
            self.jobs[job_id]["gemini_progress"] = progress
            logger.info(f"Job {job_id} Gemini progress: {progress}%")
    
    def get_job_status(self, job_id: str) -> Optional[Dict]:
        """Get current status of a job."""
        return self.jobs.get(job_id)
    
    def mark_complete(self, job_id: str, analysis_id: str):
        """Mark a job as completed."""
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = "COMPLETED"
            self.jobs[job_id]["analysis_id"] = analysis_id
            self.jobs[job_id]["embeddings_progress"] = 100
            self.jobs[job_id]["gemini_progress"] = 100
            logger.info(f"Job {job_id} completed with analysis {analysis_id}")
    
    def mark_failed(self, job_id: str, error: str):
        """Mark a job as failed."""
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = "FAILED"
            self.jobs[job_id]["error"] = error
            logger.error(f"Job {job_id} failed: {error}")
    
    async def process_analysis(self, job_id: str, url: str):
        """
        Main orchestration function for processing analysis.
        This runs as a background task.
        """
        supabase = get_supabase()
        analysis_id = None
        
        try:
            logger.info(f"Starting analysis for job {job_id}")
            
            # Step 1: Fetch comments from Apify
            logger.info("Step 1: Fetching comments from Apify")
            raw_comments = await apify_service.fetch_comments(url, max_comments=500)
            
            if not raw_comments:
                raise Exception("No comments fetched from Apify")
            
            # Step 2: Parse comments
            logger.info("Step 2: Parsing comments")
            parsed_comments = parse_quill_comments(raw_comments)
            
            if not parsed_comments:
                raise Exception("No valid comments after parsing")
            
            # Step 3: Create analysis_id
            analysis_id = str(uuid.uuid4())
            logger.info(f"Created analysis ID: {analysis_id}")
            
            # Step 4: Run embeddings and Gemini in parallel
            logger.info("Step 4: Running parallel processing (embeddings + Gemini)")
            
            # Create tasks for parallel execution
            embeddings_task = asyncio.create_task(
                self._generate_embeddings(job_id, parsed_comments, analysis_id)
            )
            
            gemini_task = asyncio.create_task(
                self._run_gemini_analysis(job_id, parsed_comments)
            )
            
            # Wait for both to complete
            embeddings_result, gemini_result = await asyncio.gather(
                embeddings_task,
                gemini_task,
                return_exceptions=True
            )
            
            # Check for errors
            if isinstance(embeddings_result, Exception):
                raise embeddings_result
            if isinstance(gemini_result, Exception):
                raise gemini_result
            
            # Step 5: Store results in Supabase
            logger.info("Step 5: Storing results in Supabase")
            
            # Insert into analysis_history
            history_data = {
                "id": analysis_id,
                "url": url,
                "platform": "youtube",
                "sentiment_score": gemini_result["sentiment_score"],
                "lead_percentage": gemini_result["lead_percentage"],
                "total_comments": gemini_result["total_comments"]
            }
            
            supabase.table("analysis_history").insert(history_data).execute()
            
            # Insert into analysis_details
            details_data = {
                "analysis_history_id": analysis_id,
                "sentiment_breakdown": gemini_result["sentiment_breakdown"],
                "leads": gemini_result["leads"],
                "top_feedback_topics": gemini_result["top_feedback_topics"],
                "top_discussed_topics": gemini_result["top_discussed_topics"],
                "actionable_todos": gemini_result.get("actionable_todos", []),
                "creator_insights": gemini_result.get("creator_insights", []),
                "competitor_insights": gemini_result.get("competitor_insights", []),
                "engagement_spikes": gemini_result["engagement_spikes"],
                "top_influencers": gemini_result["top_influencers"],
                "vibe_trend": gemini_result["vibe_trend"]
            }
            
            supabase.table("analysis_details").insert(details_data).execute()
            
            # Update job record in Supabase
            supabase.table("analysis_jobs").update({
                "status": "COMPLETED",
                "analysis_id": analysis_id,
                "embeddings_progress": 100,
                "gemini_progress": 100,
                "completed_at": datetime.now().isoformat()
            }).eq("id", job_id).execute()
            
            # Mark job as complete in memory
            self.mark_complete(job_id, analysis_id)
            
            logger.info(f"Analysis completed successfully for job {job_id}")
            
        except Exception as e:
            logger.error(f"Error processing analysis for job {job_id}: {str(e)}")
            self.mark_failed(job_id, str(e))
            
            # Update job record in Supabase
            supabase.table("analysis_jobs").update({
                "status": "FAILED",
                "error": str(e)
            }).eq("id", job_id).execute()
    
    async def _generate_embeddings(self, job_id: str, parsed_comments: list, analysis_id: str):
        """Generate embeddings and upsert to Pinecone."""
        try:
            # Extract texts for embedding
            texts = [comment["text_for_embedding"] for comment in parsed_comments]
            
            # Generate embeddings with progress callback
            embeddings = await embeddings_service.get_embeddings(
                texts,
                progress_callback=lambda p: self.update_embeddings_progress(job_id, p)
            )
            
            # Upsert to Pinecone
            await pinecone_service.upsert_to_pinecone(
                parsed_comments,
                embeddings,
                analysis_id
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Error in embeddings generation: {str(e)}")
            raise
    
    async def _run_gemini_analysis(self, job_id: str, parsed_comments: list):
        """Run Gemini analysis with progress tracking."""
        try:
            result = await gemini_service.analyze_with_gemini(
                parsed_comments,
                progress_callback=lambda p: self.update_gemini_progress(job_id, p)
            )
            return result
            
        except Exception as e:
            logger.error(f"Error in Gemini analysis: {str(e)}")
            raise


# Singleton instance
job_manager = JobManager()

