import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { validateAndCreateDispenseCommand } from '../services/fertilizerService';
import { prisma } from '../config/prisma';

export const dispenseFertilizer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'demo-user-id';
    const { plantId, nutrient } = req.body;

    if (!plantId || !nutrient) {
      return res.status(400).json({ error: 'plantId and nutrient (NITROGEN, PHOSPHORUS, POTASSIUM) are required.' });
    }

    const commandResult = await validateAndCreateDispenseCommand(userId, { plantId, nutrient });
    return res.status(201).json(commandResult);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Fertilizer dispensing validation failed.' });
  }
};

export const getFertilizerHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const plantId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const history = await prisma.fertilizerEvent.findMany({
      where: { plantId },
      orderBy: { timestamp: 'desc' }
    });

    return res.json({ history });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch fertilizer history.' });
  }
};
