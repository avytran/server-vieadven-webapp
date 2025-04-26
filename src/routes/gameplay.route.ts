import express from 'express';

import gameplayController from '../controllers/gameplay.controller';

const router = express.Router();

router.post('/update', gameplayController.updateGameplay);
router.get('/:province_id/user/:user_id', gameplayController.getGameplaysByUserIdAndProvinceId)

export default router;
