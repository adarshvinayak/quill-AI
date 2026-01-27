import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalInput from '../components/ui/BrutalInput';
import BrutalCard from '../components/ui/BrutalCard';
import BrutalBadge from '../components/ui/BrutalBadge';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('quillion_auth', 'authenticated');
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold hover:text-electricBlue mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black mb-4">QUILLION</h1>
            <BrutalBadge variant="yellow" className="mb-4">
              BETA ACCESS
            </BrutalBadge>
            <p className="font-bold text-gray-700 mb-2">
              Platform is currently in beta stage
            </p>
            <p className="font-bold text-gray-700">
              Only available for testers
            </p>
          </div>

          <BrutalCard className="mb-6">
            <h2 className="text-2xl font-black mb-6 uppercase">Tester Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-bold mb-2 text-sm">USERNAME</label>
                <BrutalInput
                  value={username}
                  onChange={setUsername}
                  placeholder="Enter username"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-sm">PASSWORD</label>
                <BrutalInput
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter password"
                  type="password"
                  error={error}
                  className="h-12"
                />
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-red-600 font-bold"
                >
                  <AlertCircle size={20} />
                  {error}
                </motion.div>
              )}
              <BrutalButton
                type="submit"
                variant="warning"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </BrutalButton>
            </form>
          </BrutalCard>

          <BrutalCard className="bg-gray-50">
            <div className="text-center">
              <p className="font-bold mb-4">Not a tester?</p>
              <BrutalButton
                variant="blue"
                size="md"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const waitlistSection = document.getElementById('waitlist');
                    waitlistSection?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full"
              >
                JOIN WAITLIST
              </BrutalButton>
            </div>
          </BrutalCard>
        </motion.div>
      </div>
    </div>
  );
}
