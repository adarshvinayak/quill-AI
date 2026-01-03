import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BrutalCard from '../ui/BrutalCard';
import CustomTooltip from '../ui/Tooltip';

interface TopicsBarChartProps {
  title: string;
  data: Array<{ topic: string; count?: number; frequency?: number }>;
  horizontal?: boolean;
  color: string;
  tooltipText?: string;
}

export default function TopicsBarChart({
  title,
  data,
  horizontal = false,
  color,
  tooltipText,
}: TopicsBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.topic,
    value: item.count || item.frequency || 0,
  }));

  return (
    <BrutalCard className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-2xl font-black uppercase">{title}</h3>
        {tooltipText && <CustomTooltip content={tooltipText} />}
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout={horizontal ? 'vertical' : 'horizontal'}
            margin={{ top: 5, right: 10, left: horizontal ? 120 : 10, bottom: horizontal ? 5 : 60 }}
            barCategoryGap="10%"
            barGap={2}
          >
            <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={2} />
            {horizontal ? (
              <>
                <XAxis type="number" stroke="#000" strokeWidth={2} tick={{ fontWeight: 'bold', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#000"
                  strokeWidth={2}
                  tick={{ fontWeight: 'bold', fontSize: 11 }}
                  width={110}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="category"
                  dataKey="name"
                  stroke="#000"
                  strokeWidth={2}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontWeight: 'bold', fontSize: 11 }}
                  interval={0}
                />
                <YAxis type="number" stroke="#000" strokeWidth={2} tick={{ fontWeight: 'bold', fontSize: 11 }} />
              </>
            )}
            <Tooltip
              contentStyle={{
                border: '4px solid black',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                fontWeight: 'bold',
              }}
            />
            <Bar dataKey="value" fill={color} stroke="#000" strokeWidth={3} maxBarSize={100} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BrutalCard>
  );
}
