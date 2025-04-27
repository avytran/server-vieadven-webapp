import express from 'express';
import authGuard from '../middlewares/authGuard.mdw';
import provinceProgressController from '../controllers/provinceProgress.controller';
import { updateProvinceProgressSchema, createProvinceProgressSchema } from '../entities/provinceProgress.entity';
import validate from '../middlewares/validate.mdw';

const router = express.Router();

router.post('/', authGuard.validateToken, validate(createProvinceProgressSchema), provinceProgressController.createProvinceProgress)
router.get('/:player_id/provinces', authGuard.validateToken, provinceProgressController.getAllProvincesOfAPlayer);
router.get('/:player_id/provinces/:province_id', authGuard.validateToken, provinceProgressController.getPlayerProvinceProgress);
router.put('/:player_id/provinces/:province_id', authGuard.validateToken, validate(updateProvinceProgressSchema), provinceProgressController.updateProvinceProgress);

export default router;