import db from '../utils/db.util';
import { User } from '../types/user'

export default {
    createAccount: async(user: User) => {
        const createdUser = await db("User")
        .insert(user)
        .returning('*')

        await db('player')
        .insert({user_id: createdUser[0].user_id, level: 1})

        const result = await db("player")
        .join("User", "player.user_id", '=', "User.user_id")
        .select('player.*', "User.*")
        .where('User.user_id', createdUser[0].user_id)

        return result;
    }
}