import express from 'express';

import provinceProgressController from '../controllers/provinceProgress.controller';

const router = express.Router();

router.get('/', provinceProgressController.getPlayerProvinceProgress);
router.put('/:playerId/:provinceId', provinceProgressController.updateProvinceProgress);

export default router;