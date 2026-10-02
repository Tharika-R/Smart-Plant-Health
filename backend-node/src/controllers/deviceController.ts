import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getPendingDeviceCommands = async (req: Request, res: Response) => {
  try {
    const deviceId = Array.isArray(req.params.deviceId) ? req.params.deviceId[0] : req.params.deviceId;

    // Find first PENDING command for this ESP32 device
    const pendingCommand = await prisma.fertilizerCommand.findFirst({
      where: {
        deviceId,
        status: 'PENDING',
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'asc' }
    });

    if (!pendingCommand) {
      return res.json({ commands: [] });
    }

    // Mark status as SENT/EXECUTING
    await prisma.fertilizerCommand.update({
      where: { id: pendingCommand.id },
      data: { status: 'SENT' }
    });

    return res.json({
      commandId: pendingCommand.id,
      plantId: pendingCommand.plantId,
      nutrient: pendingCommand.nutrient,
      amount: pendingCommand.amount,
      unit: pendingCommand.unit
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch pending commands for ESP32 device.' });
  }
};

export const reportCommandResult = async (req: Request, res: Response) => {
  try {
    const commandId = Array.isArray(req.params.commandId) ? req.params.commandId[0] : req.params.commandId;
    const { status, actualAmount } = req.body;

    const command = await prisma.fertilizerCommand.findUnique({
      where: { id: commandId }
    });

    if (!command) {
      return res.status(404).json({ error: 'Command ID not found.' });
    }

    const isSuccess = status === 'COMPLETED';
    const finalStatus = isSuccess ? 'COMPLETED' : 'FAILED';
    const now = new Date();

    // 1. Update Fertilizer Command
    const updatedCommand = await prisma.fertilizerCommand.update({
      where: { id: commandId },
      data: {
        status: finalStatus,
        completedAt: now
      }
    });

    // 2. Log Fertilizer Event if completed successfully
    if (isSuccess) {
      await prisma.fertilizerEvent.create({
        data: {
          plantId: command.plantId,
          nutrient: command.nutrient,
          amount: actualAmount || command.amount,
          unit: command.unit,
          status: 'COMPLETED',
          timestamp: now
        }
      });
    }

    return res.json({
      message: `Command ${commandId} result recorded: ${finalStatus}`,
      commandId: updatedCommand.id,
      status: updatedCommand.status,
      completedAt: updatedCommand.completedAt
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to record command execution result.' });
  }
};
