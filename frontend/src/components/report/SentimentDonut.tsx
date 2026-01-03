import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import BrutalCard from '../ui/BrutalCard';
import Tooltip from '../ui/Tooltip';

interface SentimentDonutProps {
  data: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export default function SentimentDonut({ data }: SentimentDonutProps) {
  const chartData = [
    { name: 'Positive', value: data.positive, color: '#2563eb' },
    { name: 'Neutral', value: data.neutral, color: '#facc15' },
    { name: 'Negative', value: data.negative, color: '#db2777' },
  ];

  return (
    <BrutalCard className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-2xl font-black uppercase">Sentiment Breakdown</h3>
        <Tooltip content="Distribution of emotional tone in comments. Positive: supportive and enthusiastic. Neutral: factual and informational. Negative: critical or disappointed." />
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              stroke="#000"
              strokeWidth={4}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              formatter={(value) => <span className="font-bold">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="text-center">
            <div
              className="w-full h-2 border-2 border-black mb-2"
              style={{ backgroundColor: item.color }}
            />
            <p className="font-mono text-2xl font-black">{item.value}%</p>
            <p className="text-xs font-bold uppercase">{item.name}</p>
          </div>
        ))}
      </div>
    </BrutalCard>
  );
}
