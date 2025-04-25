import { Router } from "express";
import playerItemController from "../controllers/playerItem.controller";
import validate from "../middlewares/validate.mdw";
import { updateItemOfAPlayerSchema } from "../entities/playerItem.entity";

const router = Router();


router.get("/:player_id/items", playerItemController.getAllItemsOfAPlayer);


router.put("/:player_id/items/:item_id", validate(updateItemOfAPlayerSchema), playerItemController.updateItemOfAPlayer);

export default router;