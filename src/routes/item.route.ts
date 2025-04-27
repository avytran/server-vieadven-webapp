import express from 'express';
import authGuard from '../middlewares/authGuard.mdw';
import itemController from '../controllers/item.controller';
import { createItemSchema, updateItemSchema } from '../entities/item.entity';
import validate from '../middlewares/validate.mdw'

const router = express.Router();

router.post('/', authGuard.validateToken, validate(createItemSchema), itemController.createItem)
router.get('/:id', authGuard.validateToken, itemController.getItemById)
router.get('/', authGuard.validateToken, itemController.getAllItems);
router.put('/:id', authGuard.validateToken, validate(updateItemSchema), itemController.updateItem)
router.delete('/bulk-delete', authGuard.validateToken, itemController.deleteItems);
router.delete('/:id', authGuard.validateToken, itemController.deleteItem);

export default router;