import { useState, useEffect } from 'react';

export interface MetricPoint {
  time: string;
  cpu: number;
  memory: number;
}

export function useMetricStream() {
  // We initialize data as an empty array so .slice() never crashes
  const [data, setData] = useState<MetricPoint[]>([]);
  const [currentCpu, setCurrentCpu] = useState(0);
  const [currentMem, setCurrentMem] = useState(0);
  const [latency, setLatency] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/metrics');
        if (!res.ok) throw new Error('Network response was not ok');
        
        // This is our new full payload from Supabase
        const payload = await res.json();
        
        if (isMounted) {
          // We specifically extract the array for the chart
          setData(payload.history || []);
          setCurrentCpu(payload.cpu || 0);
          setCurrentMem(payload.memory || 0);
          setLatency(payload.latency || 0);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[browser] Failed to fetch live metric:', error);
      }
    };

    // 1. Fetch immediately on load
    fetchMetrics();

    // 2. Poll every 3 seconds to match our background pulse worker
    const intervalId = setInterval(fetchMetrics, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { data, currentCpu, currentMem, latency, isLoading };
}