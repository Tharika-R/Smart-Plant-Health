import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const receiveSensorData = async (req: Request, res: Response) => {
  try {
    const { deviceId, plantId, soilMoisture, temperature, humidity, nitrogen, phosphorus, potassium } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required.' });
    }

    let targetPlantId = plantId;
    if (!targetPlantId) {
      const registeredDevice = await prisma.device.findUnique({ where: { deviceId } });
      if (registeredDevice && registeredDevice.plantId) {
        targetPlantId = registeredDevice.plantId;
      } else {
        const firstPlant = await prisma.plant.findFirst();
        targetPlantId = firstPlant ? firstPlant.id : 'demo-plant-id';
      }
    }

    // Save Sensor Reading
    const reading = await prisma.sensorReading.create({
      data: {
        deviceId,
        plantId: targetPlantId,
        soilMoisture: Number(soilMoisture) || 48.0,
        temperature: Number(temperature) || 27.0,
        humidity: Number(humidity) || 64.0,
        nitrogen: Number(nitrogen) || 35.0,
        phosphorus: Number(phosphorus) || 22.0,
        potassium: Number(potassium) || 41.0
      }
    });

    // Update Device Status
    await prisma.device.upsert({
      where: { deviceId },
      update: { status: 'ONLINE', lastSeen: new Date() },
      create: { deviceId, plantId: targetPlantId, status: 'ONLINE' }
    });

    return res.status(201).json({
      message: 'Sensor telemetry saved successfully',
      readingId: reading.id,
      timestamp: reading.timestamp
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to record sensor data.' });
  }
};

export const getLatestSensorReading = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const reading = await prisma.sensorReading.findFirst({
      where: { plantId: id },
      orderBy: { timestamp: 'desc' }
    });

    if (!reading) {
      return res.status(404).json({ error: 'No sensor telemetry found for this plant.' });
    }

    return res.json({ reading });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch latest sensor reading.' });
  }
};

export const getSensorHistory = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const history = await prisma.sensorReading.findMany({
      where: { plantId: id },
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return res.json({ history });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch sensor history.' });
  }
};
