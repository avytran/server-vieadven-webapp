import express from 'express';

import gameplayController from '../controllers/gameplay.controller';

const router = express.Router();

router.post('/update', gameplayController.updateGameplay);

export default router;
