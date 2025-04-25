import express from 'express';

import playerDailyMissionController from '../controllers/playerDailyMission.controller';
import { updateProgressSchema  } from '../entities/playerMission.entity';
import validate from '../middlewares/validate.mdw';

const router = express.Router();

router.get('/:player_id/missions', playerDailyMissionController.getAllMissionsOfAPlayer);
router.put('/:player_id/missions/:mission_id', validate(updateProgressSchema), playerDailyMissionController.updateMissionProgessOfAPlayer)

export default router;