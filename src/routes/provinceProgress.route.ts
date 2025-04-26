import express from 'express';

import provinceProgressController from '../controllers/provinceProgress.controller';
import { updateProvinceProgressSchema, createProvinceProgressSchema } from '../entities/provinceProgress.entity';
import validate from '../middlewares/validate.mdw';

const router = express.Router();

router.post('/', validate(createProvinceProgressSchema), provinceProgressController.createProvinceProgress)
router.get('/:player_id/provinces', provinceProgressController.getAllProvincesOfAPlayer);
router.get('/:player_id/provinces/:province_id', provinceProgressController.getPlayerProvinceProgress);
router.put('/:player_id/provinces/:province_id', validate(updateProvinceProgressSchema), provinceProgressController.updateProvinceProgress);

export default router;