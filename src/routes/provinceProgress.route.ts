import express from 'express';

import provinceProgressController from '../controllers/provinceProgress.controller';

const router = express.Router();

router.get('/', provinceProgressController.getPlayerProvinceProgress);
router.put('/', provinceProgressController.updateProvinceProgress);

export default router;