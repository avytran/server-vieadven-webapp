import express from 'express';
import authGuard from '../middlewares/authGuard.mdw';
import playerDailyMissionController from '../controllers/playerDailyMission.controller';
import { updateProgressSchema } from '../entities/playerMission.entity';
import validate from '../middlewares/validate.mdw';

const router = express.Router();

router.get('/:player_id/missions', authGuard.validateToken, playerDailyMissionController.getAllMissionsOfAPlayer);
router.put('/:player_id/missions/:mission_id', authGuard.validateToken, validate(updateProgressSchema), playerDailyMissionController.updateMissionProgessOfAPlayer)
router.post('/claim', authGuard.validateToken, playerDailyMissionController.claim)

export default router;