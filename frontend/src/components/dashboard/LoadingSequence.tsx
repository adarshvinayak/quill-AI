import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, MessageSquare, CheckCircle, Database } from 'lucide-react';

const loadingSteps = [
  { icon: MessageSquare, text: 'Fetching comments...' },
  { icon: Database, text: 'Generating embeddings...' },
  { icon: TrendingUp, text: 'AI analysis in progress...' },
  { icon: Users, text: 'Identifying leads...' },
  { icon: Sparkles, text: 'Finalizing insights...' },
  { icon: CheckCircle, text: 'Report ready!' },
];

interface LoadingSequenceProps {
  jobId: string;
  onComplete: (analysisId: string) => void;
  isDemoMode?: boolean;
}

export default function LoadingSequence({ jobId, onComplete, isDemoMode = false }: LoadingSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [embeddingsProgress, setEmbeddingsProgress] = useState(0);
  const [geminiProgress, setGeminiProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Demo mode - fake progress
    if (isDemoMode) {
      const startTime = Date.now();
      const totalDuration = 10000; // 10 seconds total
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalDuration) * 100, 100);
        
        // Simulate slightly different speeds for embeddings and gemini
        const embProgress = Math.min(progress * 1.1, 100);
        const gemProgress = Math.min(progress * 0.9, 100);
        
        setEmbeddingsProgress(Math.round(embProgress));
        setGeminiProgress(Math.round(gemProgress));
        
        const avgProgress = (embProgress + gemProgress) / 2;
        if (avgProgress < 20) setCurrentStep(0);
        else if (avgProgress < 40) setCurrentStep(1);
        else if (avgProgress < 70) setCurrentStep(2);
        else if (avgProgress < 90) setCurrentStep(3);
        else if (avgProgress < 100) setCurrentStep(4);
        else setCurrentStep(5);
        
        const remaining = Math.max(0, Math.round((totalDuration - elapsed) / 1000));
        setEstimatedTime(remaining);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete('demo-analysis');
          }, 500);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }

    // Real mode - poll backend
    const pollStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/status/${jobId}`);
        
        if (!response.ok) {
          throw new Error('Failed to get job status');
        }

        const data = await response.json();
        
        // Update progress
        setEmbeddingsProgress(data.embeddings_progress);
        setGeminiProgress(data.gemini_progress);
        setEstimatedTime(data.estimated_time_remaining);

        // Update current step based on progress
        const avgProgress = (data.embeddings_progress + data.gemini_progress) / 2;
        if (avgProgress < 20) {
          setCurrentStep(0); // Fetching
        } else if (avgProgress < 40) {
          setCurrentStep(1); // Embeddings
        } else if (avgProgress < 70) {
          setCurrentStep(2); // AI Analysis
        } else if (avgProgress < 90) {
          setCurrentStep(3); // Identifying leads
        } else if (avgProgress < 100) {
          setCurrentStep(4); // Finalizing
        } else {
          setCurrentStep(5); // Complete
        }

        // Check if completed
        if (data.status === 'COMPLETED' && data.analysis_id) {
          onComplete(data.analysis_id);
        } else if (data.status === 'FAILED') {
          setError(data.error || 'Analysis failed');
        }
      } catch (err) {
        console.error('Error polling status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    // Poll every 10 seconds
    const interval = setInterval(pollStatus, 10000);
    
    // Poll immediately
    pollStatus();

    return () => clearInterval(interval);
  }, [jobId, onComplete, isDemoMode]);

  const CurrentIcon = loadingSteps[currentStep].icon;
  const overallProgress = (embeddingsProgress + geminiProgress) / 2;

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="max-w-2xl w-full px-8 text-center">
          <h1 className="text-5xl font-black mb-4 uppercase text-red-600">Error</h1>
          <p className="text-xl font-bold text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="brutal-border brutal-shadow px-8 py-4 bg-electricBlue text-white font-black uppercase"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="max-w-2xl w-full px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black mb-4 uppercase">Processing Analysis</h1>
          <p className="text-xl font-bold text-gray-600">
            {estimatedTime ? `Estimated time: ${estimatedTime}s` : 'This will take a few moments...'}
          </p>
        </motion.div>

        {/* Overall Progress */}
        <div className="relative mb-8">
          <div className="h-8 brutal-border bg-white overflow-hidden">
            <motion.div
              className="h-full bg-electricBlue"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-black">{Math.round(overallProgress)}%</span>
          </div>
        </div>

        {/* Individual Progress Bars */}
        <div className="mb-8 space-y-4">
          <div>
            <p className="text-sm font-bold mb-2">Generating Embeddings</p>
            <div className="h-4 brutal-border bg-white overflow-hidden">
              <motion.div
                className="h-full bg-highvisYellow"
                animate={{ width: `${embeddingsProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs font-bold text-right mt-1">{embeddingsProgress}%</p>
          </div>

          <div>
            <p className="text-sm font-bold mb-2">AI Analysis</p>
            <div className="h-4 brutal-border bg-white overflow-hidden">
              <motion.div
                className="h-full bg-cyberPink"
                animate={{ width: `${geminiProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs font-bold text-right mt-1">{geminiProgress}%</p>
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 justify-center"
        >
          <div className="brutal-border brutal-shadow p-4 bg-highvisYellow">
            <CurrentIcon size={32} className="text-black" />
          </div>
          <p className="text-2xl font-black">{loadingSteps[currentStep].text}</p>
        </motion.div>

        <div className="mt-12 flex justify-center gap-2">
          {loadingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-12 brutal-border ${
                index <= currentStep ? 'bg-electricBlue' : 'bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
