import { Router } from 'express';
import {
  deleteBot,
  getBotById,
  getBotLogs,
  getBots,
  restartBot,
  stopBot,
} from '../controllers/bots.controller.js';

const router = Router();

router.get('/', getBots);
router.get('/:id', getBotById);
router.get('/:id/logs', getBotLogs);
router.post('/:id/restart', restartBot);
router.post('/:id/stop', stopBot);
router.delete('/:id', deleteBot);

export default router;

