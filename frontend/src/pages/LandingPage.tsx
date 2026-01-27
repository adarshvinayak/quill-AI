import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalCard from '../components/ui/BrutalCard';
import Header from '../components/landing/Header';
import WaitlistForm from '../components/landing/WaitlistForm';
import { PieChart, BarChart3, TrendingUp, MessageSquare, Users, Zap, Play, Rocket } from 'lucide-react';
import { useDemoMode } from '../contexts/DemoContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setDemoMode } = useDemoMode();

  const handleDemoClick = () => {
    setDemoMode(true);
    navigate('/dashboard');
  };

  const handleTryNowClick = () => {
    setDemoMode(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0, ease: "linear" }}
          className="text-center mb-20 relative py-16"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229, 231, 235, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        >
          <div className="relative inline-block mb-24">
            <div
              className="absolute -top-8 -left-8 text-xs font-mono text-gray-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [0, 0]
            </div>

            <div
              className="absolute -top-8 -right-8 text-xs font-mono text-gray-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [1024, 0]
            </div>

            <div
              className="absolute -bottom-8 -left-8 text-xs font-mono text-gray-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [0, 512]
            </div>

            <div
              className="absolute -bottom-8 -right-8 text-xs font-mono text-gray-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [1024, 512]
            </div>

            <div
              className="absolute -left-12 top-0 bottom-0 w-px bg-gray-300"
              style={{
                borderLeft: '1px dashed rgba(156, 163, 175, 0.5)',
              }}
            />

            <div
              className="absolute -right-12 top-0 bottom-0 w-px bg-gray-300"
              style={{
                borderRight: '1px dashed rgba(156, 163, 175, 0.5)',
              }}
            />

            <div
              className="absolute -top-12 left-0 right-0 h-px bg-gray-300"
              style={{
                borderTop: '1px dashed rgba(156, 163, 175, 0.5)',
              }}
            />

            <div
              className="absolute -bottom-12 left-0 right-0 h-px bg-gray-300"
              style={{
                borderBottom: '1px dashed rgba(156, 163, 175, 0.5)',
              }}
            />

            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight relative"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                border: '2px solid black',
                padding: '3rem 4rem',
                backgroundColor: 'white',
                boxShadow: '16px 16px 0px rgba(0, 0, 0, 1)',
                letterSpacing: '0.05em',
              }}
            >
              <div className="leading-tight">
                CUT THROUGH THE{' '}
                <span className="relative inline-block">
                  CHATTER
                  <div
                    className="absolute top-1/2 left-0 right-0 h-1 bg-red-600"
                    style={{
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                    }}
                  />
                </span>
              </div>
            </h1>

            <div
              className="absolute -left-16 top-1/2 text-xs font-mono text-gray-500"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                transform: 'translateY(-50%) rotate(-90deg)',
                transformOrigin: 'center',
              }}
            >
              ← 256px →
            </div>

            <div
              className="absolute -right-16 top-1/2 text-xs font-mono text-gray-500"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                transform: 'translateY(-50%) rotate(90deg)',
                transformOrigin: 'center',
              }}
            >
              ← 256px →
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold mb-12 max-w-3xl mx-auto text-gray-800">
            Transform thousands of comments into actionable intelligence. Identify leads, understand sentiment, and command your audience data in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BrutalButton
              variant="primary"
              size="lg"
              onClick={handleDemoClick}
              className="text-xl px-10 py-5 flex items-center gap-3"
            >
              <Play size={24} />
              DEMO
            </BrutalButton>
            
            <BrutalButton
              variant="warning"
              size="lg"
              onClick={handleTryNowClick}
              className="text-xl px-10 py-5 flex items-center gap-3"
            >
              <Rocket size={24} />
              TRY NOW
            </BrutalButton>
          </div>
          
          <p className="mt-6 text-sm font-bold text-gray-600">
            <span className="text-electricBlue">DEMO</span>: Explore with sample data • <span className="text-highvisYellow">TRY NOW</span>: Analyze real YouTube videos
          </p>
        </motion.div>

        <motion.div
          id="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4 uppercase">
            What You'll Get
          </h2>
          <p className="text-center font-bold text-lg mb-8 text-gray-700">
            Your complete comment intelligence dashboard
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BrutalCard hover>
              <div className="flex items-center justify-center mb-4">
                <PieChart size={48} className="text-electricBlue" />
              </div>
              <h3 className="font-black text-xl mb-2 text-center uppercase">
                Sentiment Analysis
              </h3>
              <p className="text-center font-bold text-gray-700">
                Instant breakdown of positive, neutral, and negative vibes across all your comments
              </p>
            </BrutalCard>

            <BrutalCard hover>
              <div className="flex items-center justify-center mb-4">
                <TrendingUp size={48} className="text-highvisYellow" />
              </div>
              <h3 className="font-black text-xl mb-2 text-center uppercase">
                Lead Detection
              </h3>
              <p className="text-center font-bold text-gray-700">
                AI automatically identifies potential customers expressing buying intent
              </p>
            </BrutalCard>

            <BrutalCard hover>
              <div className="flex items-center justify-center mb-4">
                <BarChart3 size={48} className="text-cyberPink" />
              </div>
              <h3 className="font-black text-xl mb-2 text-center uppercase">
                Topic Mining
              </h3>
              <p className="text-center font-bold text-gray-700">
                Extract what people actually care about from thousands of comments
              </p>
            </BrutalCard>

            <BrutalCard hover>
              <div className="flex items-center justify-center mb-4">
                <Users size={48} className="text-electricBlue" />
              </div>
              <h3 className="font-black text-xl mb-2 text-center uppercase">
                Influencer Identification
              </h3>
              <p className="text-center font-bold text-gray-700">
                Discover your most engaged commenters and potential brand advocates
              </p>
            </BrutalCard>

            <BrutalCard hover>
              <div className="flex items-center justify-center mb-4">
                <Zap size={48} className="text-highvisYellow" />
              </div>
              <h3 className="font-black text-xl mb-2 text-center uppercase">
                Engagement Tracking
              </h3>
              <p className="text-center font-bold text-gray-700">
                Track when and where your audience is most active and engaged
              </p>
            </BrutalCard>

            <BrutalCard hover>
              <div className="flex items-center justify-center mb-4">
                <MessageSquare size={48} className="text-cyberPink" />
              </div>
              <h3 className="font-black text-xl mb-2 text-center uppercase">
                AI Assistant
              </h3>
              <p className="text-center font-bold text-gray-700">
                Ask questions about your comments using natural language queries
              </p>
            </BrutalCard>
          </div>
        </motion.div>

        <motion.div
          id="how-it-works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-8 uppercase">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BrutalCard>
              <div className="text-center">
                <div className="inline-block bg-electricBlue text-white font-black text-3xl w-16 h-16 flex items-center justify-center brutal-border mb-4">
                  1
                </div>
                <h3 className="font-black text-xl mb-2 uppercase">Paste URL</h3>
                <p className="font-bold text-gray-700">
                  Drop your YouTube, Instagram, or X post link into the dashboard
                </p>
              </div>
            </BrutalCard>

            <BrutalCard>
              <div className="text-center">
                <div className="inline-block bg-highvisYellow text-black font-black text-3xl w-16 h-16 flex items-center justify-center brutal-border mb-4">
                  2
                </div>
                <h3 className="font-black text-xl mb-2 uppercase">AI Analyzes</h3>
                <p className="font-bold text-gray-700">
                  Our AI processes thousands of comments in seconds
                </p>
              </div>
            </BrutalCard>

            <BrutalCard>
              <div className="text-center">
                <div className="inline-block bg-cyberPink text-white font-black text-3xl w-16 h-16 flex items-center justify-center brutal-border mb-4">
                  3
                </div>
                <h3 className="font-black text-xl mb-2 uppercase">Get Insights</h3>
                <p className="font-bold text-gray-700">
                  View comprehensive reports with actionable intelligence
                </p>
              </div>
            </BrutalCard>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <BrutalCard className="!bg-white border-4 border-black max-w-3xl mx-auto">
            <h3 className="font-black text-3xl mb-6 text-center uppercase !text-highvisYellow">
              The Quillion Difference
            </h3>
            <ul className="space-y-3 font-bold text-lg !text-gray-700">
              <li className="flex items-start gap-3">
                <span className="!text-electricBlue text-2xl">→</span>
                <span className="!text-gray-700">2000+ comments analyzed instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="!text-electricBlue text-2xl">→</span>
                <span className="!text-gray-700">Lead intent detection with 12% average discovery rate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="!text-electricBlue text-2xl">→</span>
                <span className="!text-gray-700">Influencer identification and engagement scoring</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="!text-electricBlue text-2xl">→</span>
                <span className="!text-gray-700">Real-time engagement spike tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="!text-electricBlue text-2xl">→</span>
                <span className="!text-gray-700">RAG-powered AI assistant for deep insights</span>
              </li>
            </ul>
          </BrutalCard>
        </motion.div>

        <motion.div
          id="waitlist"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mb-8"
        >
          <WaitlistForm />
        </motion.div>
      </div>
    </div>
  );
}
