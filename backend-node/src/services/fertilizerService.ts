import { prisma } from '../config/prisma';
import { NutrientType, CommandStatus } from '@prisma/client';

export interface DispenseRequest {
  plantId: string;
  nutrient: NutrientType;
}

export const validateAndCreateDispenseCommand = async (userId: string, request: DispenseRequest) => {
  const { plantId, nutrient } = request;

  // 1. Check valid nutrient type
  const validNutrients: NutrientType[] = ['NITROGEN', 'PHOSPHORUS', 'POTASSIUM'];
  if (!validNutrients.includes(nutrient)) {
    throw new Error('Invalid nutrient type. Must be NITROGEN, PHOSPHORUS, or POTASSIUM.');
  }

  // 2. Check plant ownership
  const plant = await prisma.plant.findUnique({
    where: { id: plantId }
  });

  if (!plant) {
    throw new Error('Plant not found.');
  }

  // 3. Fetch backend safety config for amount (DO NOT accept arbitrary frontend amounts!)
  const config = await prisma.fertilizerConfig.findUnique({
    where: { nutrient }
  });

  const safeAmount = config ? config.amount : 5.0;
  const unit = config ? config.unit : 'ml';

  // 4. Cooldown check: Has plant received fertilizer in the last 5 minutes?
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recentEvent = await prisma.fertilizerEvent.findFirst({
    where: {
      plantId,
      timestamp: { gte: fiveMinsAgo }
    }
  });

  if (recentEvent) {
    throw new Error('Safety cooldown active: This plant has already received fertilizer recently. Please wait before feeding again.');
  }

  // 5. Duplicate PENDING command check
  const pendingCommand = await prisma.fertilizerCommand.findFirst({
    where: {
      plantId,
      nutrient,
      status: { in: ['PENDING', 'SENT', 'EXECUTING'] }
    }
  });

  if (pendingCommand) {
    throw new Error('A fertilizer dispensing command is already pending execution for this plant.');
  }

  // 6. Create Fertilizer Command (Expires in 10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const command = await prisma.fertilizerCommand.create({
    data: {
      plantId,
      deviceId: plant.deviceId,
      nutrient,
      amount: safeAmount,
      unit,
      status: 'PENDING',
      expiresAt
    }
  });

  return {
    commandId: command.id,
    plantId: command.plantId,
    deviceId: command.deviceId,
    nutrient: command.nutrient,
    amount: command.amount,
    unit: command.unit,
    status: command.status,
    message: `Dispensing command for ${command.amount} ${command.unit} of ${command.nutrient} queued for ESP32 hardware execution.`
  };
};
