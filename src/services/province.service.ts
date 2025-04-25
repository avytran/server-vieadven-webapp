import db from '../utils/db.util';

export default {
    getAllowedProvinces: async (player_id: string) => {
        const allowedProvinces = await db('province')
            .join('player', 'player.level', '=', 'province.display_order')
            .where('player.user_id', player_id)
            .select('province.*');

        if (allowedProvinces.length === 0) return null;

        return allowedProvinces;
    }
}