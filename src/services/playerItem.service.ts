import db from "../utils/db.util";

export default {
    getAllItemsOfAPlayer: async (player_id: number) => {
        try {
            const items = await db("Player_Item")
                .join("Item", "Player_Item.item_id", "Item.item_id")
                .select(
                    "Player_Item.player_id",
                    "Player_Item.item_id",
                    "Player_Item.quantity",
                    "Item.name",
                    "Item.description",
                    "Item.icon_url"
                )
                .where("Player_Item.player_id", player_id);

            return items;
        } catch (error) {
            console.error("Error fetching items for player:", error);
            throw new Error("Error fetching items for player: " + error.message);
        }
    },

    updateItemOfAPlayer: async (player_id: number, item_id: number, quantity: number) => {
        try {
            const updated = await db("Player_Item")
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