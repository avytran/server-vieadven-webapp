import { Router } from "express";
import playerItemController from "../controllers/playerItem.controller";
import validate from "../middlewares/validate.mdw";
import { updateItemOfAPlayerSchema } from "../entities/playerItem.entity";
import authGuard from '../middlewares/authGuard.mdw';

const router = Router();


router.get("/:player_id/items", authGuard.validateToken, playerItemController.getAllItemsOfAPlayer);


router.put("/:player_id/items/:item_id", authGuard.validateToken, validate(updateItemOfAPlayerSchema), playerItemController.updateItemOfAPlayer);

export default router;