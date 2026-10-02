import { Router } from 'express';
import { getPendingDeviceCommands, reportCommandResult } from '../controllers/deviceController';

const router = Router();

router.get('/devices/:deviceId/commands', getPendingDeviceCommands);
router.post('/devices/commands/:commandId/result', reportCommandResult);

export default router;
