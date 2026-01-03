import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Target } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

interface ActionableInsightsProps {
  creatorInsights: string[];
  competitorInsights: string[];
}

export default function ActionableInsights({ 
  creatorInsights, 
  competitorInsights 
}: ActionableInsightsProps) {
  const [mode, setMode] = useState<'creator' | 'competitor'>('creator');

  const insights = mode === 'creator' ? creatorInsights : competitorInsights;
  const modeTitle = mode === 'creator' 
    ? 'If This Is Your Video' 
    : 'If This Is A Competitor\'s Video';
  const modeDescription = mode === 'creator'
    ? 'Based on audience feedback, here\'s what you should focus on:'
    : 'Analyzing competitor success - here\'s what you can learn:';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase flex items-center gap-2">
            <Lightbulb size={28} />
            Actionable Insights
          </h2>
          <p className="text-sm font-bold text-gray-600 mt-1">{modeDescription}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-black uppercase text-gray-600">View As:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'creator' | 'competitor')}
            className="brutal-border px-4 py-2 font-bold bg-white cursor-pointer hover:brutal-shadow transition-shadow"
          >
            <option value="creator">Creator</option>
            <option value="competitor">Competitor Analysis</option>
          </select>
        </div>
      </div>

      <BrutalCard className={mode === 'creator' ? 'bg-electricBlue bg-opacity-5' : 'bg-cyberPink bg-opacity-5'}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`brutal-border p-3 ${mode === 'creator' ? 'bg-electricBlue' : 'bg-cyberPink'}`}>
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase">{modeTitle}</h3>
            <p className="text-sm font-bold text-gray-600">
              {mode === 'creator' 
                ? 'Actions to improve your content based on viewer feedback' 
                : 'Strategic insights to outperform this competitor'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 brutal-border bg-white"
            >
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center brutal-border font-black ${
                mode === 'creator' ? 'bg-electricBlue text-white' : 'bg-cyberPink text-white'
              }`}>
                {index + 1}
              </div>
              <p className="font-bold text-gray-800 leading-relaxed">{insight}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 brutal-border bg-highvisYellow">
          <p className="text-sm font-black uppercase mb-2">💡 Pro Tip</p>
          <p className="text-sm font-bold">
            {mode === 'creator' 
              ? 'Prioritize insights with the highest potential impact on engagement and conversions. Track metrics after implementing changes.'
              : 'Combine these insights with your unique value proposition to create content that stands out while learning from what works.'}
          </p>
        </div>
      </BrutalCard>
    </motion.div>
  );
}




