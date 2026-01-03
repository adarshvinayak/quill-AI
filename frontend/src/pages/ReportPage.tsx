import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import KPICard from '../components/report/KPICard';
import LeadIntent from '../components/report/LeadIntent';
import LeadModal from '../components/report/LeadModal';
import SentimentDonut from '../components/report/SentimentDonut';
import TopicsBarChart from '../components/report/TopicsBarChart';
import InfluencersList from '../components/report/InfluencersList';
import EngagementSpikes from '../components/report/EngagementSpikes';
import ActionableInsights from '../components/report/ActionableInsights';
import AskQuillFAB from '../components/chat/AskQuillFAB';
import Footer from '../components/footer/Footer';
import { DUMMY_COMMENTS } from '../data/dummyData';
import { analyzeComments } from '../utils/analysisHelpers';
import { checkIsDemoMode } from '../contexts/DemoContext';

export default function ReportPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isDemoMode = checkIsDemoMode();
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate demo analysis
  const demoAnalysis = useMemo(() => {
    if (!isDemoMode) return null;
    const result = analyzeComments(DUMMY_COMMENTS);
    return {
      sentimentScore: result.sentimentScore,
      leadPercentage: result.leadPercentage,
      totalComments: result.totalComments,
      sentimentBreakdown: result.sentimentBreakdown,
      leads: result.leads,
      topFeedbackTopics: result.topFeedbackTopics,
      topTopics: result.topTopics,
      actionableTodos: ['Implement requested features', 'Address user concerns', 'Engage with leads'],
      creatorInsights: result.creatorInsights,
      competitorInsights: result.competitorInsights,
      engagementTimeline: result.engagementTimeline,
      topInfluencers: result.influencers,
      vibeTrend: result.vibeTrend,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      createdAt: new Date().toISOString()
    };
  }, [isDemoMode]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) {
        setError('No analysis ID provided');
        setLoading(false);
        return;
      }

      // Demo mode - use dummy data
      if (isDemoMode || id === 'demo-analysis') {
        setAnalysis(demoAnalysis);
        setLoading(false);
        return;
      }

      // Real mode - fetch from backend
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/analysis/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch analysis');
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, isDemoMode, demoAnalysis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 uppercase">Loading Analysis...</h1>
          <div className="w-16 h-16 border-4 border-electricBlue border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 uppercase text-red-600">Error</h1>
          <p className="text-xl font-bold mb-8">{error || 'Analysis not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="brutal-border brutal-shadow px-8 py-4 bg-electricBlue text-white font-black uppercase"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 font-bold hover:text-electricBlue mb-4"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <h1 className="text-4xl sm:text-6xl font-black uppercase">
              Analysis Report
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-black mb-4 uppercase">KEY METRICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title="Sentiment Score"
                value={`${analysis.sentimentScore}%`}
                subtitle="Overall Vibe"
                icon={TrendingUp}
                color="blue"
                sparklineData={analysis.vibeTrend}
                tooltipText="Overall positivity percentage across all comments. Higher scores indicate more positive audience reception. The sparkline shows sentiment trend over time."
              />

              <LeadIntent
                percentage={analysis.leadPercentage}
                leads={analysis.leads}
                onViewAll={() => setShowLeadModal(true)}
              />

              <KPICard
                title="Total Engagement"
                value={analysis.totalComments.toLocaleString()}
                subtitle="Comments Analyzed"
                icon={Activity}
                color="pink"
                tooltipText="Total number of comments processed and analyzed. Higher engagement indicates strong audience interest and active community participation."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-black mb-4 uppercase">DATA VISUALIZATION</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '600px' }}>
              <SentimentDonut data={analysis.sentimentBreakdown} />

              <TopicsBarChart
                title="Top 5 Feedback Topics"
                data={analysis.topFeedbackTopics}
                horizontal={true}
                color="#facc15"
                tooltipText="Most mentioned feedback themes where users share suggestions, complaints, or requests. Use this to prioritize product improvements."
              />

              <TopicsBarChart
                title="Top 5 Discussed Topics"
                data={analysis.topTopics}
                horizontal={false}
                color="#2563eb"
                tooltipText="Most frequently discussed subjects in comments. Shows what your audience cares about and talks about most."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-black mb-4 uppercase">DEEP INTELLIGENCE</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfluencersList influencers={analysis.topInfluencers} />
              <EngagementSpikes data={analysis.engagementTimeline} />
            </div>
          </motion.div>

          <ActionableInsights 
            creatorInsights={analysis.creatorInsights || []}
            competitorInsights={analysis.competitorInsights || []}
          />

          <Footer />
        </div>

        <LeadModal
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          leads={analysis.leads}
        />
      </div>

      <AskQuillFAB analysisId={isDemoMode ? 'demo' : id} />
    </>
  );
}
