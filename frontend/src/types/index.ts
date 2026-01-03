export interface Comment {
  id: string;
  username: string;
  text: string;
  sentiment: number;
  isLead: boolean;
  influenceScore: number;
  timestamp: Date;
  topics: string[];
  engagementCount: number;
}

export interface AnalysisResult {
  sentimentScore: number;
  leadPercentage: number;
  totalComments: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topTopics: Array<{ topic: string; count: number }>;
  topFeedbackTopics: Array<{ topic: string; frequency: number }>;
  influencers: Array<{
    username: string;
    influenceScore: number;
    mainTopic: string;
    engagementCount: number;
  }>;
  leads: Comment[];
  engagementTimeline: Array<{ time: string; count: number }>;
  vibeTrend: number[];
  creatorInsights: string[];
  competitorInsights: string[];
}

export interface AnalysisHistory {
  id: string;
  url: string;
  platform: string;
  sentiment_score: number;
  lead_percentage: number;
  total_comments: number;
  created_at: string;
}

export interface WaitlistEntry {
  email: string;
  platform: string;
}

export type AIModel = 'gpt-4o' | 'gemini-2.0-flash-exp';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
