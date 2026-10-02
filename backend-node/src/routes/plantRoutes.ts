import { Router } from 'express';
import { createPlant, getPlants, getPlantById } from '../controllers/plantController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/plants', authenticateToken, createPlant);
router.get('/plants', authenticateToken, getPlants);
router.get('/plants/:id', authenticateToken, getPlantById);

export default router;
