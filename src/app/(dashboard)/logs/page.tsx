// src/app/logs/page.tsx
import { ScrollText } from 'lucide-react';
import { LogTable } from '@/components/dashboard/LogTable';

export default function LogsPage() {
  return (
    <main className="p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <ScrollText className="text-neutral-400" size={24} aria-hidden="true" />
              System Event Logs
            </h1>
            <p className="text-sm text-neutral-400">Historical audit trail and operational events.</p>
          </div>
        </header>

        {/* Component Reuse: Dropping in our client component */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-1">
           <LogTable />
        </div>

      </div>
    </main>
  );
}