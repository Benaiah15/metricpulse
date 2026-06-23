import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 1. Extract query parameters from the frontend
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const severity = searchParams.get('severity')?.toLowerCase();
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    // 2. Build the Prisma query dynamically
    const whereClause: any = {};
    
    if (severity && severity !== 'all') {
      whereClause.severity = severity;
    }
    
    if (search) {
      whereClause.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { service: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 3. Execute queries in parallel for maximum performance
    const [logs, totalCount] = await Promise.all([
      prisma.systemLog.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        take: limit,
      }),
      prisma.systemLog.count({ where: whereClause })
    ]);

    // Format the timestamp for the frontend UI before sending
    const formattedLogs = logs.map(log => ({
      ...log,
      timestamp: log.timestamp.toISOString().split('T')[1].substring(0, 8)
    }));

    return NextResponse.json({
      data: formattedLogs,
      meta: {
        total: totalCount,
        returned: formattedLogs.length,
      }
    });
    
  } catch (error) {
    console.error('[API_LOGS_GET]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

// 4. Add a POST route so we can easily inject test data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newLog = await prisma.systemLog.create({
      data: {
        service: body.service || 'system-core',
        message: body.message || 'Heartbeat check completed.',
        severity: body.severity || 'info',
      }
    });

    return NextResponse.json(newLog);
  } catch (error) {
    console.error('[API_LOGS_POST]', error);
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 });
  }
}