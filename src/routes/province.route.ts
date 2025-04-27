import express from 'express';
import provinceController from '../controllers/province.controller';
import authGuard from '../middlewares/authGuard.mdw';

const router = express.Router();

router.get('/:player_id/allowed', authGuard.validateToken, provinceController.getAllowedProvinces);

export default router;