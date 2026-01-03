import { Users } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';
import BrutalBadge from '../ui/BrutalBadge';
import Tooltip from '../ui/Tooltip';

interface Influencer {
  username: string;
  influenceScore: number;
  mainTopic: string;
  engagementCount: number;
}

interface InfluencersListProps {
  influencers: Influencer[];
}

export default function InfluencersList({ influencers }: InfluencersListProps) {
  return (
    <BrutalCard>
      <div className="flex items-center gap-3 mb-6">
        <Users size={32} className="text-electricBlue" />
        <h3 className="text-2xl font-black uppercase">Top Influencers</h3>
        <Tooltip content="Most engaged commenters ranked by influence score (based on comment frequency and engagement received). Main Topic shows their primary area of interest. Engagement shows total interactions." />
      </div>

      <div className="space-y-4">
        {influencers.map((influencer, idx) => (
          <div
            key={influencer.username}
            className="border-4 border-black p-4 hover:shadow-brutal-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-black text-electricBlue">
                  #{idx + 1}
                </span>
                <span className="font-bold text-lg">@{influencer.username}</span>
              </div>
              <BrutalBadge variant="yellow">{influencer.mainTopic}</BrutalBadge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-600">INFLUENCE SCORE</p>
                <p className="font-mono text-xl font-black">{influencer.influenceScore}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600">ENGAGEMENT</p>
                <p className="font-mono text-xl font-black">{influencer.engagementCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BrutalCard>
  );
}
