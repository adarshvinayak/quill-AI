import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, Instagram, Twitter, ArrowLeft, AlertCircle } from 'lucide-react';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalInput from '../components/ui/BrutalInput';
import BrutalCard from '../components/ui/BrutalCard';
import BrutalBadge from '../components/ui/BrutalBadge';
import WaitlistModal from '../components/dashboard/WaitlistModal';
import LoadingSequence from '../components/dashboard/LoadingSequence';
import Footer from '../components/footer/Footer';
import { supabase } from '../lib/supabase';
import type { AnalysisHistory } from '../types';
import { checkIsDemoMode } from '../contexts/DemoContext';

type Platform = 'youtube' | 'instagram' | 'twitter';

const DEMO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

export default function Dashboard() {
  const navigate = useNavigate();
  const isDemoMode = checkIsDemoMode();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [url, setUrl] = useState(isDemoMode ? DEMO_URL : '');
  const [urlError, setUrlError] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [waitlistModal, setWaitlistModal] = useState<{ open: boolean; platform: string }>({
    open: false,
    platform: '',
  });
  const [history, setHistory] = useState<AnalysisHistory[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('analysis_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (data) {
      setHistory(data);
    }
  };

  const handlePlatformClick = (platform: Platform) => {
    if (platform === 'instagram' || platform === 'twitter') {
      setWaitlistModal({
        open: true,
        platform: platform === 'instagram' ? 'Instagram' : 'X (Twitter)',
      });
    } else {
      setSelectedPlatform(platform);
    }
  };

  const handleAnalyze = async () => {
    setUrlError('');

    if (!url) {
      setUrlError('Please enter a URL');
      return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setUrlError('Please enter a valid YouTube URL');
      return;
    }

    // Demo mode - skip backend and use fake loading
    if (isDemoMode) {
      setLoading(true);
      return;
    }

    // Real mode - call backend
    try {
      setLoading(true);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start analysis');
      }

      const data = await response.json();
      setJobId(data.job_id);
    } catch (error) {
      console.error('Error starting analysis:', error);
      setUrlError(error instanceof Error ? error.message : 'Failed to start analysis');
      setLoading(false);
    }
  };

  const handleLoadingComplete = async (analysisId: string) => {
    setLoading(false);
    setJobId(null);
    navigate(`/report/${analysisId}`);
  };

  return (
    <>
      {loading && (isDemoMode ? (
        <LoadingSequence jobId="demo" onComplete={handleLoadingComplete} isDemoMode={true} />
      ) : jobId ? (
        <LoadingSequence jobId={jobId} onComplete={handleLoadingComplete} isDemoMode={false} />
      ) : null)}

      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 font-bold hover:text-electricBlue"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-7xl font-black mb-4">
              ANALYSIS HUB
            </h1>
            <p className="text-xl font-bold">
              Select platform and paste URL to begin
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-black mb-6 uppercase">Select Platform</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <BrutalCard
                hover
                onClick={() => handlePlatformClick('youtube')}
                className={`cursor-pointer ${selectedPlatform === 'youtube' ? '!bg-electricBlue !text-white' : 'bg-white text-black'}`}
              >
                <div className="flex items-center justify-center gap-4 p-4">
                  <Youtube size={48} className={selectedPlatform === 'youtube' ? '!text-white' : 'text-black'} />
                  <div className="text-left">
                    <h3 className={`text-2xl font-black ${selectedPlatform === 'youtube' ? '!text-white' : 'text-black'}`}>YouTube</h3>
                    <BrutalBadge variant={selectedPlatform === 'youtube' ? 'yellow' : 'blue'}>
                      ACTIVE
                    </BrutalBadge>
                  </div>
                </div>
              </BrutalCard>

              <BrutalCard
                hover
                onClick={() => handlePlatformClick('instagram')}
                className="cursor-pointer grayscale opacity-70 text-black"
              >
                <div className="flex items-center justify-center gap-4 p-4 relative">
                  <Instagram size={48} className="text-black" />
                  <div className="text-left">
                    <h3 className="text-2xl font-black">Instagram</h3>
                    <BrutalBadge variant="white">LOCKED</BrutalBadge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-black text-3xl rotate-[-15deg] text-cyberPink">
                      BETA
                    </span>
                  </div>
                </div>
              </BrutalCard>

              <BrutalCard
                hover
                onClick={() => handlePlatformClick('twitter')}
                className="cursor-pointer grayscale opacity-70 text-black"
              >
                <div className="flex items-center justify-center gap-4 p-4 relative">
                  <Twitter size={48} className="text-black" />
                  <div className="text-left">
                    <h3 className="text-2xl font-black">X</h3>
                    <BrutalBadge variant="white">LOCKED</BrutalBadge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-black text-3xl rotate-[-15deg] text-cyberPink">
                      BETA
                    </span>
                  </div>
                </div>
              </BrutalCard>
            </div>
          </div>

          <div className="mb-12">
            <BrutalCard className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-black mb-6 uppercase">Enter URL</h2>
              
              {isDemoMode && (
                <div className="mb-4 p-4 brutal-border bg-highvisYellow flex items-start gap-3">
                  <AlertCircle size={24} className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black uppercase mb-1">Demo Mode</p>
                    <p className="font-bold text-sm">
                      This is a sample URL with dummy data. The URL is not editable in demo mode.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <BrutalInput
                  value={url}
                  onChange={isDemoMode ? () => {} : setUrl}
                  placeholder="https://youtube.com/watch?v=..."
                  error={urlError}
                  className={`h-20 text-lg ${isDemoMode ? 'cursor-not-allowed opacity-75' : ''}`}
                  disabled={isDemoMode}
                />
                <BrutalButton
                  variant="warning"
                  size="lg"
                  onClick={handleAnalyze}
                  className="w-full text-xl"
                >
                  {isDemoMode ? 'VIEW DEMO ANALYSIS' : 'ANALYZE NOW'}
                </BrutalButton>
              </div>
            </BrutalCard>
          </div>

          {history.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-6 uppercase">Past Analyses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                  <BrutalCard key={item.id} hover onClick={() => navigate(`/report/${item.id}`)}>
                    <div className="mb-4">
                      <BrutalBadge variant="blue">
                        {item.platform.toUpperCase()}
                      </BrutalBadge>
                    </div>
                    <p className="font-bold mb-2 truncate text-sm">{item.url}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs font-bold text-gray-600">SENTIMENT</p>
                        <p className="text-2xl font-mono font-black text-electricBlue">
                          {item.sentiment_score}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-600">LEADS</p>
                        <p className="text-2xl font-mono font-black text-highvisYellow">
                          {item.lead_percentage}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-600">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </BrutalCard>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>

      <WaitlistModal
        isOpen={waitlistModal.open}
        onClose={() => setWaitlistModal({ open: false, platform: '' })}
        platform={waitlistModal.platform}
      />
    </>
  );
}
