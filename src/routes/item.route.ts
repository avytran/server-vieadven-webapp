import express from 'express';

import itemController from '../controllers/item.controller';
import { createItemSchema } from '../entities/item.entity';
import validate from '../middlewares/validate.mdw'

const router = express.Router();

router.post('/', validate(createItemSchema), itemController.createItem)
router.get('/', itemController.getAllItems);

export default router;