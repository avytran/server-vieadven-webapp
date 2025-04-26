import express from 'express';
import provinceController from '../controllers/province.controller';

const router = express.Router();

router.get('/:player_id/allowed', provinceController.getAllowedProvinces);

export default router;