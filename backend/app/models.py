from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum


class JobStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class AnalyzeRequest(BaseModel):
    url: str


class AnalyzeResponse(BaseModel):
    job_id: str
    status: JobStatus


class JobStatusResponse(BaseModel):
    status: JobStatus
    embeddings_progress: int
    gemini_progress: int
    estimated_time_remaining: Optional[int]
    error: Optional[str]
    analysis_id: Optional[str]


class Comment(BaseModel):
    id: str
    author: str
    comment: str
    date: str
    voteCount: int
    replyCount: int
    type: str
    text_for_embedding: str


class SentimentBreakdown(BaseModel):
    positive: int
    neutral: int
    negative: int


class LeadComment(BaseModel):
    username: str
    text: str
    timestamp: str
    sentiment: float


class TopicWithComments(BaseModel):
    topic: str
    count: int
    comments: List[Dict[str, str]]


class Influencer(BaseModel):
    username: str
    influenceScore: int
    mainTopic: str
    engagementCount: int


class EngagementSpike(BaseModel):
    time: str
    count: int


class AnalysisResult(BaseModel):
    sentiment_score: int
    sentiment_breakdown: SentimentBreakdown
    lead_percentage: int
    leads: List[LeadComment]
    top_feedback_topics: List[TopicWithComments]
    top_discussed_topics: List[TopicWithComments]
    actionable_todos: List[str]  # Deprecated - kept for backward compatibility
    creator_insights: List[str]
    competitor_insights: List[str]
    engagement_spikes: List[EngagementSpike]
    top_influencers: List[Influencer]
    total_comments: int
    vibe_trend: List[int]


class ChatRequest(BaseModel):
    message: str
    model: str
    analysis_id: str


class ChatResponse(BaseModel):
    response: str

