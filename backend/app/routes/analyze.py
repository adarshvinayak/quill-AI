from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.models import (
    AnalyzeRequest,
    AnalyzeResponse,
    JobStatusResponse,
    AnalysisResult,
    JobStatus
)
from app.database import get_supabase
from app.services.job_manager import job_manager
import logging
import uuid
import re

logger = logging.getLogger(__name__)
router = APIRouter()


def validate_youtube_url(url: str) -> bool:
    """Validate if the URL is a YouTube video URL."""
    youtube_patterns = [
        r'(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=[\w-]+',
        r'(?:https?:\/\/)?(?:www\.)?youtu\.be\/[\w-]+'
    ]
    return any(re.match(pattern, url) for pattern in youtube_patterns)


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_video(
    request: AnalyzeRequest,
    background_tasks: BackgroundTasks
):
    """
    Start analysis for a YouTube video URL.
    Creates a job and processes it in the background.
    """
    try:
        # Validate URL
        if not validate_youtube_url(request.url):
            raise HTTPException(
                status_code=400,
                detail="Invalid YouTube URL. Please provide a valid YouTube video URL."
            )
        
        # Create job ID
        job_id = str(uuid.uuid4())
        
        # Create job in database
        supabase = get_supabase()
        supabase.table("analysis_jobs").insert({
            "id": job_id,
            "url": request.url,
            "status": "PROCESSING",
            "embeddings_progress": 0,
            "gemini_progress": 0
        }).execute()
        
        # Create job in memory
        job_manager.create_job(job_id, request.url)
        
        # Start background processing
        background_tasks.add_task(
            job_manager.process_analysis,
            job_id,
            request.url
        )
        
        logger.info(f"Started analysis job {job_id} for URL: {request.url}")
        
        return AnalyzeResponse(
            job_id=job_id,
            status=JobStatus.PROCESSING
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start analysis: {str(e)}")


@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    """
    Get the current status of an analysis job.
    Returns progress for embeddings and Gemini analysis.
    """
    try:
        # Try to get from memory first
        job_status = job_manager.get_job_status(job_id)
        
        if not job_status:
            # Fallback to database
            supabase = get_supabase()
            result = supabase.table("analysis_jobs").select("*").eq("id", job_id).execute()
            
            if not result.data:
                raise HTTPException(status_code=404, detail="Job not found")
            
            job_data = result.data[0]
            job_status = {
                "status": job_data["status"],
                "embeddings_progress": job_data["embeddings_progress"],
                "gemini_progress": job_data["gemini_progress"],
                "error": job_data.get("error"),
                "analysis_id": job_data.get("analysis_id")
            }
        
        # Calculate estimated time remaining
        avg_progress = (job_status["embeddings_progress"] + job_status["gemini_progress"]) / 2
        estimated_time = None
        if avg_progress > 0 and avg_progress < 100:
            # Rough estimation: ~2 minutes total
            estimated_time = int(120 * (100 - avg_progress) / 100)
        
        return JobStatusResponse(
            status=JobStatus(job_status["status"]),
            embeddings_progress=job_status["embeddings_progress"],
            gemini_progress=job_status["gemini_progress"],
            estimated_time_remaining=estimated_time,
            error=job_status.get("error"),
            analysis_id=job_status.get("analysis_id")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting job status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get job status: {str(e)}")


@router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    """
    Get the complete analysis results for a given analysis ID.
    Returns data for the report page.
    """
    try:
        supabase = get_supabase()
        
        # Fetch from analysis_history
        history_result = supabase.table("analysis_history").select("*").eq("id", analysis_id).execute()
        
        if not history_result.data:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        history = history_result.data[0]
        
        # Fetch from analysis_details
        details_result = supabase.table("analysis_details").select("*").eq("analysis_history_id", analysis_id).execute()
        
        if not details_result.data:
            raise HTTPException(status_code=404, detail="Analysis details not found")
        
        details = details_result.data[0]
        
        # Combine and return
        return {
            "sentimentScore": history["sentiment_score"],
            "leadPercentage": history["lead_percentage"],
            "totalComments": history["total_comments"],
            "sentimentBreakdown": details["sentiment_breakdown"],
            "leads": details["leads"],
            "topFeedbackTopics": details["top_feedback_topics"],
            "topTopics": details["top_discussed_topics"],
            "actionableTodos": details.get("actionable_todos", []),
            "creatorInsights": details.get("creator_insights", []),
            "competitorInsights": details.get("competitor_insights", []),
            "engagementTimeline": details["engagement_spikes"],
            "topInfluencers": details["top_influencers"],
            "vibeTrend": details["vibe_trend"],
            "url": history["url"],
            "createdAt": history["created_at"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get analysis: {str(e)}")

