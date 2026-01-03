import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import ChatModal from './ChatModal';

interface AskQuillFABProps {
  analysisId?: string;
}

export default function AskQuillFAB({ analysisId }: AskQuillFABProps) {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setShowChat(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40
                   w-16 h-16 sm:w-20 sm:h-20
                   bg-electricBlue brutal-border brutal-shadow
                   flex items-center justify-center
                   cursor-pointer"
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            '8px 8px 0px 0px rgba(0,0,0,1)',
            '12px 12px 0px 0px rgba(0,0,0,1)',
            '8px 8px 0px 0px rgba(0,0,0,1)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
        }}
        whileTap={{
          scale: 0.95,
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        }}
      >
        <MessageSquare size={32} className="text-white" />
      </motion.button>

      <ChatModal isOpen={showChat} onClose={() => setShowChat(false)} analysisId={analysisId} />
    </>
  );
}
