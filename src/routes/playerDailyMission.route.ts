import express from 'express';

import playerDailyMissionController from '../controllers/playerDailyMission.controller';
import { updateProgressSchema  } from '../entities/playerMission.entity';
import validate from '../middlewares/validate.mdw';

const router = express.Router();

router.get('/', playerDailyMissionController.getAllMissionsOfAPlayer);
router.put('/:id', validate(updateProgressSchema), playerDailyMissionController.updateMissionProgessOfAPlayer)

export default router;