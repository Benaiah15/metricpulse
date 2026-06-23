// src/app/alerts/page.tsx
import { BellRing, Plus } from 'lucide-react';

export default function AlertsPage() {
  return (
    <main className="p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BellRing className="text-neutral-400" size={24} aria-hidden="true" />
              Alert Rules
            </h1>
            <p className="text-sm text-neutral-400">Configure threshold triggers and notification policies.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors">
            <Plus size={16} aria-hidden="true" />
            New Rule
          </button>
        </header>

        {/* Alert Rules List Placeholder */}
        <section aria-label="Configured Alerts" className="rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <th className="p-4 font-medium">Policy Name</th>
                <th className="p-4 font-medium">Metric</th>
                <th className="p-4 font-medium">Condition</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
              <tr className="hover:bg-neutral-950/40 transition-colors">
                <td className="p-4 font-medium text-neutral-200">Critical CPU Spike</td>
                <td className="p-4 text-neutral-400">CPU Usage</td>
                <td className="p-4 font-mono text-xs">&gt; 85% for 2m</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Active
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-neutral-950/40 transition-colors">
                <td className="p-4 font-medium text-neutral-200">High API Latency</td>
                <td className="p-4 text-neutral-400">Avg Latency</td>
                <td className="p-4 font-mono text-xs">&gt; 250ms for 5m</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Active
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-neutral-950/40 transition-colors opacity-60">
                <td className="p-4 font-medium text-neutral-200">Memory Leak Warning</td>
                <td className="p-4 text-neutral-400">Memory Allocation</td>
                <td className="p-4 font-mono text-xs">&gt; 90% for 10m</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs font-medium border bg-neutral-500/10 text-neutral-400 border-neutral-500/20">
                    Disabled
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>
    </main>
  );
}