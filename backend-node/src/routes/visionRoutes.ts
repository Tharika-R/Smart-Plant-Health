import { Router } from 'express';
import { analyzePlantVision, getVisionHistory } from '../controllers/visionController';
import { authenticateToken } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/plant-vision/analyze', authenticateToken, upload.single('image'), analyzePlantVision);
router.get('/plants/:id/vision-history', authenticateToken, getVisionHistory);

export default router;
