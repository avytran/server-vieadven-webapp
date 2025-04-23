import db from '../utils/db.util';
import { Player_ProvinceProgress } from '../types/provinceProgress';

export default {
    getPlayerProvinceProgress: async (playerId: string, provinceId: string) => {
        const playerProvinceProgress = await db('player_provinceprogress')
        .join('User', 'player_provinceprogress.player_id', '=', 'User.user_id')
        .join('player', 'player_provinceprogress.player_id', '=', 'player.user_id')
        .join('province', 'player_provinceprogress.province_id', '=', 'province.province_id')
        .select('player_provinceprogress.*', 'User.name', 'player.last_province_id', 'province.province_name', 'province.coordinates')
        .where('player_provinceprogress.player_id', playerId)
        .andWhere('player_provinceprogress.province_id', provinceId)
        .first();

        if(!playerProvinceProgress)
            return null;

        return playerProvinceProgress;
    },
    updateProvinceProgress: async (playerId: string, provinceId: string, player_provinceprogress: Player_ProvinceProgress) => {
        const updatedProvinceProgress = await db('player_provinceprogress')
        .where('player_id', playerId)
        .andWhere('province_id', provinceId)
        .update(player_provinceprogress)
        .returning('*')

        if(updatedProvinceProgress.length === 0)
            return null;

        return updatedProvinceProgress[0];
    }
}