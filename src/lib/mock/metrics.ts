export type MetricPoint = {
  time: string;
  cpu: number;
  memory: number;
  latency: number;
};

export const generateInitialData = (points = 20): MetricPoint[] => {
  const data: MetricPoint[] = [];
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 2000);
    data.push({
      time: time.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
      cpu: Math.floor(Math.random() * 40) + 20, 
      memory: Math.floor(Math.random() * 30) + 40, 
      latency: Math.floor(Math.random() * 100) + 50, 
    });
  }
  return data;
};

// Added 'forceSpike' parameter for our debug trigger
export const generateNewPoint = (forceSpike: boolean = false): MetricPoint => {
  const now = new Date();
  const isSpike = forceSpike || Math.random() > 0.95; 
  
  return {
    time: now.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
    cpu: isSpike ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 40) + 20, // Spikes go 85-100%
    memory: isSpike ? Math.floor(Math.random() * 15) + 80 : Math.floor(Math.random() * 30) + 40,
    latency: isSpike ? Math.floor(Math.random() * 400) + 300 : Math.floor(Math.random() * 100) + 50,
  };
};

export type LogSeverity = 'info' | 'warning' | 'error';

export type LogEntry = {
  id: string;
  timestamp: string;
  service: string;
  message: string;
  severity: LogSeverity;
};

const MOCK_SERVICES = ['auth-service', 'payment-gateway', 'api-router', 'worker-pool-a'];

const MOCK_MESSAGES: Record<LogSeverity, string[]> = {
  info: [
    'Database connection pool health check optimal.',
    'User authentication token refreshed successfully.',
    'Cache eviction routine completed execution.',
  ],
  warning: [
    'API gateway latency exceeded threshold of 200ms.',
    'Redis memory allocation reaching 80% capacity.',
    'Rate limit threshold approached by external client.',
  ],
  error: [
    'Database connection timeout occurred on read replica.',
    'Payment gateway webhook failed to verify signature.',
    'Internal Server Error (500) dispatched on route /v1/checkout.',
  ]
};

export const generateInitialLogs = (count = 10): LogEntry[] => {
  const logs: LogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - i * 60000); 
    const rand = Math.random();
    const severity: LogSeverity = rand > 0.85 ? 'error' : rand > 0.6 ? 'warning' : 'info';
    const messages = MOCK_MESSAGES[severity];
    
    logs.push({
      id: crypto.randomUUID(),
      timestamp: time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      service: MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      severity,
    });
  }
  return logs;
};