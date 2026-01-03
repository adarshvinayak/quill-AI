import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrutalCard from '../ui/BrutalCard';
import BrutalButton from '../ui/BrutalButton';
import Tooltip from '../ui/Tooltip';
import { TrendingUp } from 'lucide-react';
import type { Comment } from '../../types';
import { getTopLeadComments } from '../../utils/analysisHelpers';

interface LeadIntentProps {
  percentage: number;
  leads: Comment[];
  onViewAll: () => void;
}

export default function LeadIntent({ percentage, leads, onViewAll }: LeadIntentProps) {
  const [showPreview, setShowPreview] = useState(false);
  const topLeads = getTopLeadComments(leads, 3);

  return (
    <BrutalCard
      className="relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-black uppercase">Lead Intent</h3>
          <Tooltip content="Percentage of comments showing buying intent or interest in your product/service. These are potential customers expressing readiness to purchase or learn more." />
        </div>
        <TrendingUp size={32} className="text-highvisYellow" />
      </div>

      <div className="text-center my-6">
        <p className="font-mono text-7xl font-black text-highvisYellow">
          {percentage}%
        </p>
        <p className="font-black text-sm mt-2 uppercase">Potential Customers</p>
      </div>

      <BrutalButton
        variant="warning"
        size="sm"
        onClick={onViewAll}
        className="w-full"
      >
        View All {leads.length} Leads
      </BrutalButton>

      <AnimatePresence>
        {showPreview && topLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-10"
          >
            <div className="bg-white brutal-border brutal-shadow p-4 space-y-2">
              <p className="font-black text-sm uppercase mb-2">
                Top Sales-Heavy Comments:
              </p>
              {topLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="border-2 border-black p-2 bg-highvisYellow bg-opacity-20"
                >
                  <p className="font-bold text-xs mb-1">@{lead.username}</p>
                  <p className="text-sm">{lead.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BrutalCard>
  );
}
