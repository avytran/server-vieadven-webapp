import express from 'express';

import provinceProgressController from '../controllers/provinceProgress.controller';
import { updateProvinceProgressSchema } from '../entities/provinceProgress.entity';
import validate from '../middlewares/validate.mdw';

const router = express.Router();

router.get('/', provinceProgressController.getPlayerProvinceProgress);
router.put('/:playerId/:provinceId', validate(updateProvinceProgressSchema), provinceProgressController.updateProvinceProgress);

export default router;