import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import BrutalButton from '../ui/BrutalButton';
import { useChatAI } from '../../hooks/useChatAI';
import type { AIModel } from '../../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisId?: string;
}

export default function ChatModal({ isOpen, onClose, analysisId }: ChatModalProps) {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('gpt-4o');
  const { messages, loading, error, sendMessage, clearMessages } = useChatAI(analysisId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input, selectedModel);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    clearMessages();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white brutal-border brutal-shadow-lg w-full max-w-4xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b-4 border-black">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black uppercase">Ask Quill AI</h2>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                  className="brutal-border px-4 py-2 font-bold bg-white"
                >
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gemini-2.0-flash-exp">Gemini 2.5 Pro</option>
                </select>
              </div>
              <button
                onClick={handleClose}
                className="brutal-border p-2 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-2xl font-black mb-4 uppercase">
                    What do you want to know?
                  </p>
                  <p className="font-bold text-gray-600">
                    Ask anything about the comments and I'll give you data-driven answers.
                  </p>
                </div>
              )}

              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 brutal-border brutal-shadow-sm ${
                      message.role === 'user'
                        ? 'bg-electricBlue text-white'
                        : 'bg-white text-black'
                    }`}
                  >
                    <p className="text-xs font-black uppercase mb-2">
                      {message.role === 'user' ? 'YOU' : 'QUILL AI'}
                    </p>
                    <p className="whitespace-pre-wrap font-bold">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white brutal-border brutal-shadow-sm p-4">
                    <p className="text-xs font-black uppercase mb-2">QUILL AI</p>
                    <p className="font-mono font-bold">
                      Analyzing<span className="animate-pulse">_</span>
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-cyberPink text-white brutal-border p-4">
                  <p className="font-black">ERROR:</p>
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t-4 border-black">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask Quill anything..."
                  className="flex-1 h-12 px-4 brutal-border brutal-shadow-sm bg-white text-lg focus:outline-none focus:brutal-shadow"
                />
                <BrutalButton
                  variant="primary"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="h-12 px-6"
                >
                  <Send size={20} />
                </BrutalButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
