import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BrutalButton from '../ui/BrutalButton';
import type { Comment } from '../../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Comment[];
}

export default function LeadModal({ isOpen, onClose, leads }: LeadModalProps) {
  const sortedLeads = [...leads].sort((a, b) => b.sentiment - a.sentiment);

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
            className="bg-white brutal-border brutal-shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b-4 border-black">
              <div>
                <h2 className="text-3xl font-black uppercase">Lead Database</h2>
                <p className="font-bold text-highvisYellow">
                  {leads.length} POTENTIAL CUSTOMERS IDENTIFIED
                </p>
              </div>
              <button
                onClick={onClose}
                className="brutal-border p-2 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-4 border-black">
                  <thead className="bg-highvisYellow">
                    <tr>
                      <th className="border-2 border-black p-3 text-left font-black uppercase">
                        Username
                      </th>
                      <th className="border-2 border-black p-3 text-left font-black uppercase">
                        Comment
                      </th>
                      <th className="border-2 border-black p-3 text-left font-black uppercase">
                        Intent Score
                      </th>
                      <th className="border-2 border-black p-3 text-left font-black uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeads.map((lead) => (
                      <tr key={lead.id} className="border-b-2 border-black hover:bg-gray-50">
                        <td className="border-2 border-black p-3 font-bold">
                          @{lead.username}
                        </td>
                        <td className="border-2 border-black p-3">
                          {lead.text}
                        </td>
                        <td className="border-2 border-black p-3 text-center">
                          <span className="font-mono font-black text-lg text-electricBlue">
                            {Math.round(lead.sentiment * 100)}
                          </span>
                        </td>
                        <td className="border-2 border-black p-3 font-mono text-sm">
                          {lead.timestamp.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 border-t-4 border-black flex justify-end">
              <BrutalButton variant="primary" onClick={onClose}>
                Close
              </BrutalButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
