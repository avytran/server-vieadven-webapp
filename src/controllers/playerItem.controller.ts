import { Request, Response } from "express";
import playerItemService from "../services/playerItem.service";

export default {
    getAllItemsOfAPlayer: async (req: Request, res: Response): Promise<void> => {
        const { player_id } = req.params;

        try {
            const items = await playerItemService.getAllItemsOfAPlayer(player_id);

            if (!items || items.length === 0) {
                res.status(404).json({
                    message: "No items found for the player",
                    data: [],
                });
                return;
            }

            res.status(200).json({
                message: "Successfully retrieved items",
                data: items,
            });
        } catch (error) {
            console.error("Error fetching items for player:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
        }
    },

    updateItemOfAPlayer: async (req: Request, res: Response): Promise<void> => {
        const { player_id, item_id } = req.params;
        const { quantity } = req.body;

        if (!quantity || typeof quantity !== "number") {
            res.status(400).json({
                message: "Quantity is required and must be a number",
            });
            return;
        }

        try {
            const updatedItem = await playerItemService.updateItemOfAPlayer(
                player_id,
                item_id,
                quantity
            );

            if (!updatedItem) {
                res.status(404).json({
                    message: "Player or item not found",
                });
                return;
            }

            res.status(200).json({
                message: "Successfully updated item quantity",
                data: updatedItem,
            });
        } catch (error) {
            console.error("Error updating item for player:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
        }
    },
};