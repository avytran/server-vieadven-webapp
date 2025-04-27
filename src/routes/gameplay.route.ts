import express from 'express';
import authGuard from '../middlewares/authGuard.mdw';
import gameplayController from '../controllers/gameplay.controller';

const router = express.Router();

router.post('/update', authGuard.validateToken, gameplayController.updateGameplay);
router.get('/:province_id/user/:user_id', authGuard.validateToken, gameplayController.getGameplaysByUserIdAndProvinceId)

export default router;
