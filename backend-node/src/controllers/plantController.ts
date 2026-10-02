import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { prisma } from '../config/prisma';

export const createPlant = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required.' });
    }

    const { name, plantType, ageDays, growthStage, location, deviceId } = req.body;

    if (!name || !plantType) {
      return res.status(400).json({ error: 'Plant name and plantType are required.' });
    }

    const plant = await prisma.plant.create({
      data: {
        userId,
        name,
        plantType,
        ageDays: Number(ageDays) || 1,
        growthStage: growthStage || 'Seedling',
        location: location || 'Indoor',
        deviceId: deviceId || 'ESP32_001'
      }
    });

    // Also register or link Device
    if (deviceId) {
      await prisma.device.upsert({
        where: { deviceId },
        update: { plantId: plant.id, status: 'ONLINE', lastSeen: new Date() },
        create: { deviceId, plantId: plant.id, status: 'ONLINE' }
      });
    }

    return res.status(201).json({ message: 'Plant created successfully', plant });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create plant.' });
  }
};

export const getPlants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const plants = await prisma.plant.findMany({
      where: userId ? { userId } : {},
      include: {
        sensorReadings: { take: 1, orderBy: { timestamp: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ plants });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch plants.' });
  }
};

export const getPlantById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const plant = await prisma.plant.findUnique({
      where: { id },
      include: {
        sensorReadings: { take: 10, orderBy: { timestamp: 'desc' } },
        analyses: { take: 5, orderBy: { createdAt: 'desc' } },
        fertilizerEvents: { take: 5, orderBy: { timestamp: 'desc' } }
      }
    });

    if (!plant) {
      return res.status(404).json({ error: 'Plant not found.' });
    }

    return res.json({ plant });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch plant details.' });
  }
};
