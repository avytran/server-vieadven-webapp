import express from 'express';

import leaderboardController from '../controllers/leaderboard.controller';

const router = express.Router();

router.get('/top-10', leaderboardController.getTop10);
router.get('/:id', leaderboardController.getRankById);  

export default router;
