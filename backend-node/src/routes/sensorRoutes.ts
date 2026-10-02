import { Router } from 'express';
import { receiveSensorData, getLatestSensorReading, getSensorHistory } from '../controllers/sensorController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/devices/sensor-data', receiveSensorData);
router.get('/plants/:id/sensors/latest', authenticateToken, getLatestSensorReading);
router.get('/plants/:id/sensors/history', authenticateToken, getSensorHistory);

export default router;
