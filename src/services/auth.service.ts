import db from '../utils/db.util';
import { User, Login } from '../types/user'

export default {
    createAccount: async (user: User) => {
        const existingUser = await db('User')
            .where('email', user.email)
            .first();

        if (existingUser) {
            throw new Error('Email already exists');
        }

        const createdUser = await db("User")
            .insert(user)
            .returning('*')

        await db('player')
            .insert({ user_id: createdUser[0].user_id, level: 1 })

        const result = await db("player")
            .join("User", "player.user_id", '=', "User.user_id")
            .select('player.*', "User.*")
            .where('User.user_id', createdUser[0].user_id)

        return result;
    },
    login: async (loginInfo: Login) => {
        const user = await db("User")
            .join("player", "User.user_id", "=", "player.user_id")
            .where("User.email", loginInfo.email)
            .select("User.*", "player.level")
            .first()

        if (!user)
            return null;

        return user;
    }
}