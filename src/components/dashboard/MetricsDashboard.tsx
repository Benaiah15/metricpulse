"use client";

import { Activity, Server, AlertTriangle, Bug } from 'lucide-react';
import { useMetricStream } from '@/hooks/useMetricStream';
import { RealTimeChart } from './RealTimeChart';
import { LogTable } from './LogTable';
import { AlertBanner } from './AlertBanner';

export function MetricsDashboard() {
  // We now destructure the data and the trigger function from the updated hook
  const { data, currentCpu, currentMem, latency, isLoading } = useMetricStream();
  // Reconstruct latestData for the AlertBanner using our live database numbers
// Reconstruct latestData for the AlertBanner using our live database numbers
const latestData = {
  time: new Date().toLocaleTimeString(),
  cpu: currentCpu,
  memory: currentMem, // <--- Add a comma right here!
  latency: latency
};

  return (
    <div className="space-y-6">
      
      {/* Dynamic Alert Banner */}
      <AlertBanner latestData={latestData} />

      {/* Top Metric Cards Grid */}
      <section aria-label="Key Metrics" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-900 flex flex-col gap-2">
          <div className="flex items-center justify-between text-neutral-400">
            <h2 className="text-sm font-medium">CPU Usage</h2>
            <Activity size={18} aria-hidden="true" />
          </div>
          <div className={`text-3xl font-semibold tabular-nums tracking-tight ${latestData.cpu >= 85 ? 'text-red-500' : ''}`}>
            {latestData.cpu}%
          </div>
        </div>
        
        <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-900 flex flex-col gap-2">
          <div className="flex items-center justify-between text-neutral-400">
            <h2 className="text-sm font-medium">Memory Allocation</h2>
            <Server size={18} aria-hidden="true" />
          </div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight">
            {latestData.memory}%
          </div>
        </div>
        
        <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-900 flex flex-col gap-2">
          <div className="flex items-center justify-between text-neutral-400">
            <h2 className="text-sm font-medium">Avg Latency</h2>
            <AlertTriangle size={18} aria-hidden="true" />
          </div>
          <div className={`text-3xl font-semibold tabular-nums tracking-tight ${latestData.latency >= 250 ? 'text-red-500' : ''}`}>
            {latestData.latency}ms
          </div>
        </div>
      </section>

      {/* Main Chart Area */}
      <section aria-label="System Metrics Chart" className="w-full h-[400px] rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <RealTimeChart data={data} />
      </section>

      {/* System Event Logs */}
      <LogTable />
    </div>
  );
}