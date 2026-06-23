"use client";

import { AlertOctagon } from 'lucide-react';
import type { MetricPoint } from '@/lib/mock/metrics';

interface AlertBannerProps {
  latestData: MetricPoint;
}

export function AlertBanner({ latestData }: AlertBannerProps) {
  // Enterprise thresholds
  const isCpuCritical = latestData.cpu >= 85;
  const isLatencyCritical = latestData.latency >= 250;

  if (!isCpuCritical && !isLatencyCritical) {
    return null; // Do not render anything if system is healthy
  }

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="flex items-center gap-3 p-4 mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400"
    >
      <AlertOctagon size={20} aria-hidden="true" className="shrink-0" />
      <div className="flex flex-col">
        <strong className="text-sm font-semibold text-red-500">Critical System Alert</strong>
        <span className="text-sm">
          {isCpuCritical && isLatencyCritical 
            ? `Multiple thresholds breached: CPU at ${latestData.cpu}% and Latency at ${latestData.latency}ms.`
            : isCpuCritical 
              ? `CPU usage has exceeded safe operating thresholds (${latestData.cpu}%).`
              : `API Latency has degraded significantly (${latestData.latency}ms).`
          }
        </span>
      </div>
    </div>
  );
}