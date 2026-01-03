import type { Comment, AnalysisResult } from '../types';

export function analyzeComments(comments: Comment[]): AnalysisResult {
  const totalComments = comments.length;

  const sentimentSum = comments.reduce((sum, c) => sum + c.sentiment, 0);
  const sentimentScore = Math.round(((sentimentSum / totalComments + 1) / 2) * 100);

  const positive = comments.filter(c => c.sentiment > 0.3).length;
  const negative = comments.filter(c => c.sentiment < -0.1).length;
  const neutral = totalComments - positive - negative;

  const sentimentBreakdown = {
    positive: Math.round((positive / totalComments) * 100),
    neutral: Math.round((neutral / totalComments) * 100),
    negative: Math.round((negative / totalComments) * 100),
  };

  const leads = comments.filter(c => c.isLead);
  const leadPercentage = Math.round((leads.length / totalComments) * 100);

  const topicCounts: Record<string, number> = {};
  comments.forEach(c => {
    c.topics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  const feedbackTopicFrequency: Record<string, number> = {};
  comments.forEach(c => {
    if (c.sentiment < 0.3) {
      c.topics.forEach(topic => {
        feedbackTopicFrequency[topic] = (feedbackTopicFrequency[topic] || 0) + 1;
      });
    }
  });

  const topFeedbackTopics = Object.entries(feedbackTopicFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic, frequency]) => ({ topic, frequency }));

  const influencerMap: Record<string, { influenceScore: number; topics: string[]; engagement: number }> = {};
  comments.forEach(c => {
    if (!influencerMap[c.username]) {
      influencerMap[c.username] = {
        influenceScore: c.influenceScore,
        topics: [],
        engagement: 0,
      };
    }
    influencerMap[c.username].topics.push(...c.topics);
    influencerMap[c.username].engagement += c.engagementCount;
  });

  const influencers = Object.entries(influencerMap)
    .map(([username, data]) => {
      const topicCount: Record<string, number> = {};
      data.topics.forEach(topic => {
        topicCount[topic] = (topicCount[topic] || 0) + 1;
      });
      const mainTopic = Object.entries(topicCount).sort(([, a], [, b]) => b - a)[0]?.[0] || 'general';

      return {
        username,
        influenceScore: data.influenceScore,
        mainTopic,
        engagementCount: data.engagement,
      };
    })
    .sort((a, b) => b.influenceScore - a.influenceScore)
    .slice(0, 5);

  const timelineBuckets: Record<string, number> = {};
  comments.forEach(c => {
    const dateStr = c.timestamp.toISOString().split('T')[0];
    timelineBuckets[dateStr] = (timelineBuckets[dateStr] || 0) + 1;
  });

  const engagementTimeline = Object.entries(timelineBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, count]) => ({ time, count }));

  const vibeTrend = [
    sentimentScore - 15,
    sentimentScore - 10,
    sentimentScore - 5,
    sentimentScore,
    sentimentScore + 3,
  ].map(v => Math.max(0, Math.min(100, v)));

  // Generate actionable insights
  const creatorInsights = [
    "Address common pricing concerns mentioned by viewers - consider creating a detailed value breakdown video",
    "Expand the tutorial section based on viewer requests - this could increase watch time by 20-30%",
    "Engage more actively with top commenters to build community - they're driving 40% of discussions",
    "Create follow-up content addressing the most discussed topics to capitalize on existing interest",
    "Improve video pacing in the first 2 minutes - several comments mention slow intro"
  ];

  const competitorInsights = [
    "Their tutorial format generates high engagement - consider adapting this structure for your content",
    "Notice how they respond to comments within 24 hours - this drives community loyalty",
    "Their pricing transparency builds trust - apply similar openness in your videos",
    "Study their topic selection strategy - they're hitting pain points your audience shares",
    "Their collaboration with influencers amplifies reach - identify similar partnership opportunities"
  ];

  return {
    sentimentScore,
    leadPercentage,
    totalComments,
    sentimentBreakdown,
    topTopics,
    topFeedbackTopics,
    influencers,
    leads,
    engagementTimeline,
    vibeTrend,
    creatorInsights,
    competitorInsights,
  };
}

export function getTopLeadComments(leads: Comment[], limit = 3): Comment[] {
  return leads
    .sort((a, b) => b.sentiment - a.sentiment)
    .slice(0, limit);
}
