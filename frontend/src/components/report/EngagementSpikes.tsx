import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BrutalCard from '../ui/BrutalCard';
import CustomTooltip from '../ui/Tooltip';

interface EngagementSpikesProps {
  data: Array<{ time: string; count: number }>;
}

export default function EngagementSpikes({ data }: EngagementSpikesProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count,
  }));

  return (
    <BrutalCard>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-2xl font-black uppercase">Engagement Spikes</h3>
        <CustomTooltip content="Timeline showing when comment activity peaked. Spikes indicate viral moments or high-interest periods. Use this to identify what triggered increased engagement." />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={2} />
          <XAxis
            dataKey="time"
            stroke="#000"
            strokeWidth={2}
            tick={{ fontWeight: 'bold' }}
          />
          <YAxis stroke="#000" strokeWidth={2} tick={{ fontWeight: 'bold' }} />
          <Tooltip
            contentStyle={{
              border: '4px solid black',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
              fontWeight: 'bold',
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={4}
            fill="#2563eb"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="font-bold text-sm text-gray-600">
          Peak activity: {Math.max(...data.map((d) => d.count))} comments
        </p>
      </div>
    </BrutalCard>
  );
}
