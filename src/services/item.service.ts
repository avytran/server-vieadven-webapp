import db from '../utils/db.util';
import { Item } from '../types/item'

export default {
    createItem: async (item: Item) => {
        return await db('item')
            .insert(item)
            .returning('*')
    },
    getAllItems: async () => {
        const items = await db('item')
            .select('*')

        if (items.length === 0)
            return null;

        return items;
    },
    deleteItem: async (id: string) => {
        return await db('item')
            .where('item_id', id)
            .del();
    },
    deleteItems: async (item_ids: string[]) => {
        if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0)
            return null;

        return db.transaction(async (trx) => {
            let affectedRows = 0;
            for (const itemId of item_ids) {
                const deletedItem = await trx("item")
                    .where('item_id', itemId)
                    .del();
                affectedRows += deletedItem;
            }

            return affectedRows;
        });
    },
    updateItem: async (id: string, item: Item) => {
        const updatedItem = await db('item')
            .where('item_id', id)
            .update(item)
            .returning('*')

        if (updatedItem.length === 0)
            return null;

        return updatedItem;
    },
    getItemById: async (id: string) => {
        const item = await db('item')
        .select('*')
        .where('item_id', id)
        .first()

        if(!item)
            return null;

        return item;
    }
}
