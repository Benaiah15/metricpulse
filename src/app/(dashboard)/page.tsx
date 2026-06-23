import { CheckCircle2 } from 'lucide-react';
import { MetricsDashboard } from '@/components/dashboard/MetricsDashboard';

export default function Dashboard() {
  return (
    <main className="p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
            <p className="text-sm text-neutral-400">Real-time production metrics</p>
          </div>
          <div 
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-md text-sm font-medium"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 size={16} className="text-emerald-500" aria-hidden="true" />
            <span className="text-neutral-300">System Operational</span>
          </div>
        </header>

        <MetricsDashboard />

      </div>
    </main>
  );
}