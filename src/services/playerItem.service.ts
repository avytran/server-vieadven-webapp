import db from "../utils/db.util";

export default {
    getAllItemsOfAPlayer: async (player_id: string) => {
        try {
            const items = await db("player_item")
                .join("item", "player_item.item_id", "item.item_id")
                .select(
                    "player_item.*",
                    "item.*",
                )
                .where("player_item.player_id", player_id);

            return items;
        } catch (error) {
            console.error("Error fetching items for player:", error);
            throw new Error("Error fetching items for player: " + error.message);
        }
    },

    updateItemOfAPlayer: async (player_id: string, item_id: string, quantity: number) => {
        try {
            const updated = await db("player_item")
                .where({ player_id, item_id })
                .increment("quantity", quantity)
                .returning(["player_id", "item_id", "quantity"]);

            return updated.length > 0 ? updated[0] : null;
        } catch (error) {
            console.error("Error updating item for player:", error);
            throw new Error("Error updating item for player: " + error.message);
        }
    },
};