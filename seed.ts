import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to Supabase...');
  
  // Clear out any weird partial data
  await prisma.systemLog.deleteMany();
  console.log('Cleared old logs.');

  console.log('Generating 50 realistic server events...');
  
  const services = ['auth-gateway', 'payment-processor', 'database-cluster', 'cache-node', 'frontend-edge'];
  const infoMessages = ['Health check passed.', 'Payload delivered successfully.', 'Cache refreshed.', 'User session established.'];
  const warningMessages = ['High memory usage detected.', 'Query execution slow.', 'Rate limit approaching.', 'Connection retry attempted.'];
  const errorMessages = ['Failed JWT validation from edge node.', 'Database connection timeout.', 'Unhandled promise rejection.', 'Payment gateway unreachable.'];

  for (let i = 0; i < 50; i++) {
    // Randomize severity
    const rand = Math.random();
    let severity = 'info';
    let message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
    
    if (rand > 0.7) {
      severity = 'warning';
      message = warningMessages[Math.floor(Math.random() * warningMessages.length)];
    }
    if (rand > 0.9) {
      severity = 'error';
      message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    }

    // Fire directly into the database
    await prisma.systemLog.create({
      data: {
        service: services[Math.floor(Math.random() * services.length)],
        message: message,
        severity: severity,
        // Generate a random time within the last 24 hours
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000))
      }
    });
  }
  
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });