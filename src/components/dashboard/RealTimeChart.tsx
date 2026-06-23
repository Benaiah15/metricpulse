"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { type MetricPoint } from '@/lib/mock/metrics';

interface RealTimeChartProps {
  data: MetricPoint[];
}

export function RealTimeChart({ data }: RealTimeChartProps) {
  // Prevent hydration mismatches by ensuring data exists
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-full min-h-[300px]" aria-label="Real-time system metrics area chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            minTickGap={30}
          />
          <YAxis 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#f5f5f5' }}
            itemStyle={{ color: '#e5e5e5' }}
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="cpu" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorCpu)" 
            isAnimationActive={false} 
          />
          <Area 
            type="monotone" 
            dataKey="memory" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorMemory)" 
            isAnimationActive={false} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}