import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import BrutalButton from '../ui/BrutalButton';
import { useNavigate } from 'react-router-dom';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
}

export default function WaitlistModal({
  isOpen,
  onClose,
  platform,
}: WaitlistModalProps) {
  const navigate = useNavigate();

  const handleJoinWaitlist = () => {
    onClose();
    navigate('/');
    setTimeout(() => {
      const waitlistSection = document.getElementById('waitlist');
      waitlistSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white brutal-border brutal-shadow-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <Lock size={32} className="text-gray-600" />
                <h2 className="text-3xl font-black uppercase">
                  {platform}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="brutal-border p-2 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center py-6">
              <p className="font-bold text-xl mb-6">
                Join waitlist to get early access
              </p>
              <p className="font-bold text-gray-700 mb-8">
                {platform} integration is currently under development. Be the first to know when it launches.
              </p>
              <BrutalButton
                variant="warning"
                size="lg"
                className="w-full"
                onClick={handleJoinWaitlist}
              >
                JOIN WAITLIST
              </BrutalButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
