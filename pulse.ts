import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function startPulse() {
  console.log('⚡ Starting real-time metric pulse...');
  console.log('Press Ctrl+C to stop.');

  // Base starting values
  let currentCpu = 45;
  let currentMem = 60;

  // Fire a new database insert every 3 seconds
  setInterval(async () => {
    // Generate realistic fluctuating values
    currentCpu = Math.max(10, Math.min(95, currentCpu + (Math.random() * 20 - 10)));
    currentMem = Math.max(20, Math.min(90, currentMem + (Math.random() * 10 - 5)));
    const latency = Math.floor(Math.random() * 50) + 40;

    await prisma.serverMetric.create({
      data: {
        cpu: currentCpu,
        memory: currentMem,
        latency: latency
      }
    });

    process.stdout.write(`\r[${new Date().toLocaleTimeString()}] Pulse sent to cloud DB 🟢 `);
  }, 3000);
}

startPulse();