import db from '../utils/db.util';

export default {
    getAllowedProvinces: async (player_id: string) => {
        const player = await db('player').where({ user_id: player_id }).first();
        if (!player) return [];

        const allowedProvinces = await db('province')
            .where('display_order', '<=', player.level)
            .select('*');

        if (allowedProvinces.length === 0) return [];

        return allowedProvinces;
    }
}