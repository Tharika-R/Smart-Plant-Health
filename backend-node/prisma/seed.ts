import { PrismaClient, NutrientType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Plantora Node.js Prisma Database...');

  // 1. Create Demo User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@plantora.local' },
    update: {},
    create: {
      email: 'demo@plantora.local',
      name: 'Plant Lover',
      password: hashedPassword
    }
  });

  console.log(`Created user: ${user.name} (${user.email})`);

  // 2. Create Fertilizer Configurations (Demo Safe Amounts)
  const nutrients: NutrientType[] = ['NITROGEN', 'PHOSPHORUS', 'POTASSIUM'];
  for (const n of nutrients) {
    await prisma.fertilizerConfig.upsert({
      where: { nutrient: n },
      update: { amount: 5.0, unit: 'ml' },
      create: {
        nutrient: n,
        amount: 5.0,
        unit: 'ml'
      }
    });
  }
  console.log('Created default safe demo fertilizer configurations (5 mL each).');

  // 3. Create Demo Plant
  const plant = await prisma.plant.create({
    data: {
      userId: user.id,
      name: 'Sunny Tomato',
      plantType: 'Tomato',
      ageDays: 55,
      growthStage: 'Flowering',
      location: 'Sunny Balcony',
      deviceId: 'ESP32_001',
      moistureThreshold: 45.0,
      tempThreshold: 30.0
    }
  });
  console.log(`Created demo plant: ${plant.name}`);

  // 4. Register ESP32 Device
  await prisma.device.upsert({
    where: { deviceId: 'ESP32_001' },
    update: { plantId: plant.id, status: 'ONLINE', lastSeen: new Date() },
    create: {
      deviceId: 'ESP32_001',
      plantId: plant.id,
      status: 'ONLINE',
      lastSeen: new Date()
    }
  });

  // 5. Seed Initial Sensor Readings
  await prisma.sensorReading.create({
    data: {
      deviceId: 'ESP32_001',
      plantId: plant.id,
      soilMoisture: 48.0,
      temperature: 27.4,
      humidity: 64.0,
      nitrogen: 32.0,
      phosphorus: 45.0,
      potassium: 50.0
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
