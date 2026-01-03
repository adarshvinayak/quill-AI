import { LucideIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import BrutalCard from '../ui/BrutalCard';
import Tooltip from '../ui/Tooltip';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  sparklineData?: number[];
  tooltipText?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  sparklineData,
  tooltipText,
}: KPICardProps) {
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'text-electricBlue';
      case 'yellow':
        return 'text-highvisYellow';
      case 'pink':
        return 'text-cyberPink';
      default:
        return 'text-black';
    }
  };

  const getColorHex = () => {
    switch (color) {
      case 'blue':
        return '#2563eb';
      case 'yellow':
        return '#facc15';
      case 'pink':
        return '#db2777';
      default:
        return '#000';
    }
  };

  const chartData = sparklineData?.map((value, index) => ({ index, value })) || [];

  return (
    <BrutalCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-black uppercase">{title}</h3>
          {tooltipText && <Tooltip content={tooltipText} />}
        </div>
        <Icon size={32} className={getColorClass()} />
      </div>

      <div className="text-center my-6">
        <p className={`font-mono text-7xl font-black ${getColorClass()}`}>
          {value}
        </p>
        {subtitle && (
          <p className="font-black text-sm mt-2 uppercase">{subtitle}</p>
        )}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={getColorHex()}
                strokeWidth={4}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs font-bold text-center mt-2 text-gray-600">
            VIBE TREND
          </p>
        </div>
      )}
    </BrutalCard>
  );
}
