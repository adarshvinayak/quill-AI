import google.generativeai as genai
from app.config import settings
import logging
import json
from typing import List, Dict, Any, Callable, Optional
import re

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.google_api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    async def analyze_with_gemini(
        self,
        parsed_comments: List[Dict[str, Any]],
        progress_callback: Optional[Callable[[int], None]] = None
    ) -> Dict[str, Any]:
        """
        Analyze comments using Gemini 1.5 Pro to extract insights.
        
        Args:
            parsed_comments: List of parsed comment objects
            progress_callback: Optional callback to report progress (0-100)
            
        Returns:
            Analysis results as a structured dictionary
        """
        try:
            logger.info(f"Analyzing {len(parsed_comments)} comments with Gemini")
            
            if progress_callback:
                progress_callback(10)
            
            # Prepare the prompt
            prompt = self._build_analysis_prompt(parsed_comments)
            
            if progress_callback:
                progress_callback(30)
            
            # Call Gemini API
            logger.info("Sending request to Gemini API")
            response = self.model.generate_content(prompt)
            
            if progress_callback:
                progress_callback(80)
            
            # Parse response
            result_text = response.text
            logger.info("Received response from Gemini")
            
            # Extract JSON from response
            analysis = self._extract_json_from_response(result_text)
            
            if progress_callback:
                progress_callback(100)
            
            logger.info("Successfully parsed Gemini response")
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing with Gemini: {str(e)}")
            raise Exception(f"Failed to analyze with Gemini: {str(e)}")
    
    def _build_analysis_prompt(self, comments: List[Dict[str, Any]]) -> str:
        """Build the analysis prompt for Gemini."""
        
        # Format comments for the prompt
        comments_text = ""
        for i, comment in enumerate(comments[:500], 1):  # Limit to 500 for token limits
            comments_text += f"\n{i}. Author: @{comment['author']}\n"
            comments_text += f"   Date: {comment['date']}\n"
            comments_text += f"   Likes: {comment['voteCount']} | Replies: {comment['replyCount']}\n"
            comments_text += f"   Comment: {comment['comment']}\n"
        
        prompt = f"""You are an expert data analyst specializing in social media sentiment analysis and lead generation.

Analyze the following {len(comments)} YouTube comments and provide a comprehensive analysis.

IMPORTANT NOTES:
- Comments with high voteCount (likes) represent collective opinions of many people
- replyCount shows active engagement and discussion
- Focus on actionable insights for the content creator

COMMENTS DATA:
{comments_text}

Provide your analysis in STRICTLY VALID JSON format with the following structure:

{{
  "sentiment_score": <integer 0-100, overall positivity>,
  "sentiment_breakdown": {{
    "positive": <percentage of positive comments>,
    "neutral": <percentage of neutral comments>,
    "negative": <percentage of negative comments>
  }},
  "lead_percentage": <percentage showing buying intent>,
  "leads": [
    {{
      "username": "<author>",
      "text": "<comment text>",
      "timestamp": "<date>",
      "sentiment": <0.0-1.0>
    }}
  ],
  "top_feedback_topics": [
    {{
      "topic": "<topic name>",
      "count": <frequency>,
      "comments": [
        {{"author": "<username>", "text": "<excerpt>"}}
      ]
    }}
  ],
  "top_discussed_topics": [
    {{
      "topic": "<topic name>",
      "count": <frequency>,
      "comments": [
        {{"author": "<username>", "text": "<excerpt>"}}
      ]
    }}
  ],
  "actionable_todos": [
    "<legacy field - use creator_insights instead>"
  ],
  "creator_insights": [
    "<actionable insight 1 IF this is the creator's video - what should THEY do based on audience feedback>",
    "<actionable insight 2 for creator>",
    "<actionable insight 3 for creator>",
    "<actionable insight 4 for creator>",
    "<actionable insight 5 for creator>"
  ],
  "competitor_insights": [
    "<strategic insight 1 IF analyzing a COMPETITOR - what can the USER learn and apply to their own content>",
    "<strategic insight 2 for competitor analysis>",
    "<strategic insight 3 for competitor analysis>",
    "<strategic insight 4 for competitor analysis>",
    "<strategic insight 5 for competitor analysis>"
  ],
  "engagement_spikes": [
    {{"time": "YYYY-MM-DD", "count": <number>}}
  ],
  "top_influencers": [
    {{
      "username": "<author>",
      "influenceScore": <based on likes and replies>,
      "mainTopic": "<primary discussion topic>",
      "engagementCount": <total likes + replies>
    }}
  ],
  "total_comments": {len(comments)}
}}

IMPORTANT for insights:
- creator_insights: Direct actions the VIDEO OWNER should take (e.g., "Address pricing concerns", "Expand tutorial section")
- competitor_insights: What the ANALYZER can learn (e.g., "Replicate their tutorial format", "Study their engagement tactics")

Return ONLY the JSON object, no markdown formatting or additional text."""

        return prompt
    
    def _extract_json_from_response(self, text: str) -> Dict[str, Any]:
        """Extract and parse JSON from Gemini response."""
        try:
            # Remove markdown code blocks if present
            text = re.sub(r'```json\s*', '', text)
            text = re.sub(r'```\s*', '', text)
            text = text.strip()
            
            # Parse JSON
            result = json.loads(text)
            
            # Calculate vibe_trend (simple approximation)
            sentiment_score = result.get('sentiment_score', 50)
            vibe_trend = [
                max(0, min(100, sentiment_score - 15)),
                max(0, min(100, sentiment_score - 10)),
                max(0, min(100, sentiment_score - 5)),
                sentiment_score,
                max(0, min(100, sentiment_score + 3))
            ]
            result['vibe_trend'] = vibe_trend
            
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from Gemini: {str(e)}")
            logger.error(f"Response text: {text[:500]}")
            raise Exception("Invalid JSON response from Gemini")


# Singleton instance
gemini_service = GeminiService()

