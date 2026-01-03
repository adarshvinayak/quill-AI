import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrutalButton from '../ui/BrutalButton';
import BrutalInput from '../ui/BrutalInput';
import { supabase } from '../../lib/supabase';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !feedback) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const { error: submitError } = await supabase.from('feedback').insert([
      {
        name,
        email,
        feedback,
      },
    ]);

    setLoading(false);

    if (submitError) {
      setError('Failed to submit feedback. Please try again.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setEmail('');
      setFeedback('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white brutal-border p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black uppercase">
                  Send Feedback
                </h2>
                <button
                  onClick={onClose}
                  className="hover:text-electricBlue transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 brutal-border">
                    <Send size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-2">THANK YOU!</h3>
                  <p className="font-bold text-gray-700">
                    Your feedback has been submitted successfully.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2 text-sm uppercase">
                      Name
                    </label>
                    <BrutalInput
                      value={name}
                      onChange={setName}
                      placeholder="Your name"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-sm uppercase">
                      Email
                    </label>
                    <BrutalInput
                      value={email}
                      onChange={setEmail}
                      placeholder="your@email.com"
                      type="email"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-sm uppercase">
                      Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="What feature or improvement would you like to see?"
                      className="w-full brutal-border p-3 font-bold focus:outline-none focus:ring-4 focus:ring-electricBlue resize-none"
                      rows={6}
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 font-bold text-sm">{error}</p>
                  )}

                  <BrutalButton
                    type="submit"
                    variant="warning"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
                  </BrutalButton>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
