import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🌱 PLANTORA NODE.JS EXPRESS BACKEND STARTED`);
  console.log(`==================================================`);
  console.log(`🚀 Server listening on: http://localhost:${PORT}`);
  console.log(`🤖 AI Provider: Google Gemini Vision API ONLY`);
  console.log(`🐘 Database: PostgreSQL (Prisma ORM)`);
  console.log(`==================================================\n`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});
