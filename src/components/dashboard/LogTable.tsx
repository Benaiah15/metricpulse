"use client";

import { useState, useEffect, useRef } from 'react';
import type { LogEntry, LogSeverity } from '@/lib/mock/metrics';
import { Search, AlertCircle } from 'lucide-react';

export function LogTable() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Input State
  const [searchInput, setSearchInput] = useState('');
  // Debounced State (What actually hits the API)
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<LogSeverity | 'all'>('all');

  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Debounce Logic: Only update the query state 300ms after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // 2. Secure Fetch Logic with Request Cancellation
  useEffect(() => {
    // Cancel any in-flight request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          search: debouncedSearch,
          severity: severityFilter,
          limit: '50'
        });

        const res = await fetch(`/api/logs?${params.toString()}`, {
          signal: abortControllerRef.current?.signal,
        });

        if (!res.ok) throw new Error('Failed to fetch logs');
        
        const payload = await res.json();
        setLogs(payload.data);
      } catch (err: unknown) {
        // Ignore AbortErrors, they are intentional
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Unable to load system logs. Please try again later.');
        console.error('Log fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch, severityFilter]);

  const severityStyles: Record<LogSeverity, string> = {
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <section aria-label="System Event Logs" className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Live Event Logs</h2>
          <p className="text-xs text-neutral-400">Server-side filtered audit trail</p>
        </div>
        
        {/* Controls Layout */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-neutral-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-700 w-64 transition-colors"
              aria-label="Search logs"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as LogSeverity | 'all')}
            className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-sm text-neutral-200 focus:outline-none focus:border-neutral-700 cursor-pointer transition-colors"
            aria-label="Filter by severity"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Semantic Accessible Table Data */}
      <div className="overflow-x-auto border border-neutral-800 rounded">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <th className="p-3 font-medium w-32">Timestamp</th>
              <th className="p-3 font-medium w-48">Service</th>
              <th className="p-3 font-medium w-24">Severity</th>
              <th className="p-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
            {error ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-red-400 text-sm flex items-center justify-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </td>
              </tr>
            ) : isLoading ? (
              // Secure Loading State
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500 text-sm">
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-400"></span>
                    Querying server logs...
                  </span>
                </td>
              </tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-950/40 transition-colors">
                  <td className="p-3 font-mono text-xs tabular-nums text-neutral-500">{log.timestamp}</td>
                  <td className="p-3 font-mono text-xs text-neutral-400">{log.service}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${severityStyles[log.severity]}`}>
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 truncate text-neutral-200 max-w-xl" title={log.message}>
                    {log.message}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500 text-sm">
                  No log entries matched your query parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}