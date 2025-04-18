import db from '../utils/db.util';
import { Item } from '../types/item'

export default {
    createItem: async (item: Item) => {
        return await db('item')
        .insert(item)
        .returning('*')
    }
}
