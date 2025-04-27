import express from 'express';
import authGuard from '../middlewares/authGuard.mdw';
import leaderboardController from '../controllers/leaderboard.controller';

const router = express.Router();

router.get('/top-10', authGuard.validateToken, leaderboardController.getTop10);
router.get('/:id', authGuard.validateToken, leaderboardController.getRankById);

export default router;
