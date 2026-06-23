import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch the 20 most recent metric data points, sorted newest to oldest
    const rawMetrics = await prisma.serverMetric.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    // If the database is empty, return a safe fallback
    if (rawMetrics.length === 0) {
      return NextResponse.json({
        cpu: 0,
        memory: 0,
        latency: 0,
        history: []
      });
    }

    // The charts expect the history array to be sorted oldest to newest (left to right)
    const sortedHistory = rawMetrics.reverse().map(m => ({
      time: m.timestamp.toISOString().split('T')[1].substring(0, 5),
      cpu: Math.round(m.cpu),
      memory: Math.round(m.memory)
    }));

    // The current state is the absolute newest data point
    const current = rawMetrics[rawMetrics.length - 1];

    return NextResponse.json({
      cpu: Math.round(current.cpu),
      memory: Math.round(current.memory),
      latency: current.latency,
      history: sortedHistory
    });

  } catch (error) {
    console.error('[API_METRICS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}