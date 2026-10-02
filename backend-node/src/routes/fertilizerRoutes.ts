import { Router } from 'express';
import { dispenseFertilizer, getFertilizerHistory } from '../controllers/fertilizerController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/fertilizer/dispense', authenticateToken, dispenseFertilizer);
router.get('/plants/:id/fertilizer-history', authenticateToken, getFertilizerHistory);

export default router;
