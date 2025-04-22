import express from 'express';

import playerDailyMissionController from '../controllers/playerDailyMission.controller';

const router = express.Router();

router.get('/', playerDailyMissionController.getAllMissionsOfAPlayer)

export default router;