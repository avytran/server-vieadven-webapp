import db from '../utils/db.util';
import { Player_ProvinceProgress } from '../types/provinceProgress';

export default {
    getAllProvincesOfAPlayer: async (player_id: string) => {
        const playerProvinceProgress = await db('player_provinceprogress')
            .where('player_provinceprogress.player_id', player_id);

        if (playerProvinceProgress.length === 0)
            return null;

        return playerProvinceProgress;
    },
    getPlayerProvinceProgress: async (player_id: string, province_id: string) => {
        const playerProvinceProgress = await db('player_provinceprogress')
            .join('User', 'player_provinceprogress.player_id', '=', 'User.user_id')
            .join('player', 'player_provinceprogress.player_id', '=', 'player.user_id')
            .join('province', 'player_provinceprogress.province_id', '=', 'province.province_id')
            .select('player_provinceprogress.*', 'User.name', 'player.last_province_id', 'province.province_name', 'province.coordinates')
            .where('player_provinceprogress.player_id', player_id)
            .andWhere('player_provinceprogress.province_id', province_id)
            .first();

        if (!playerProvinceProgress)
            return null;

        return playerProvinceProgress;
    },
    updateProvinceProgress: async (playerId: string, provinceId: string, player_provinceprogress: Player_ProvinceProgress) => {
        const updatedProvinceProgress = await db('player_provinceprogress')
            .where('player_id', playerId)
            .andWhere('province_id', provinceId)
            .update(player_provinceprogress)
            .returning('*')

        if (updatedProvinceProgress.length === 0)
            return null;

        return updatedProvinceProgress[0];
    },
    createProvinceProgress: async (provinceProgress: Player_ProvinceProgress) => {
        const { player_id, province_id, ...updateData } = provinceProgress;
    
        // 1. Check nếu đã có player_provinceprogress với player_id + province_id
        const existingProgress = await db('player_provinceprogress')
            .where({ player_id, province_id })
            .first();
    
        let createdOrUpdatedProgress;
    
        if (existingProgress) {
            // 2a. Nếu đã có => update lại thông tin
            createdOrUpdatedProgress = await db('player_provinceprogress')
                .where({ player_id, province_id })
                .update(updateData)
                .returning('*');
        } else {
            // 2b. Nếu chưa có => insert mới
            createdOrUpdatedProgress = await db('player_provinceprogress')
                .insert(provinceProgress)
                .returning('*');
        }
    
        const progress = createdOrUpdatedProgress[0];
    
        // 3. Lấy tất cả landmark của province
        const landmarks = await db('landmark')
            .select('landmark_id')
            .where('province_id', province_id);
    
        if (landmarks.length === 0) {
            throw new Error('No landmarks found for this province');
        }
    
        // 4. Tạo gameplay cho từng landmark
        const gameplayRecords = landmarks.map(lm => ({
            user_id: player_id,
            landmark_id: lm.landmark_id,
            star: 0,
            score: 0,
            is_completed: false
        }));
    
        // 5. Insert gameplay: chỉ insert nếu chưa tồn tại (tránh trùng user_id + landmark_id)
        // PostgreSQL sẽ cần thêm `onConflict`
        await db('gameplay')
            .insert(gameplayRecords)
            .onConflict(['user_id', 'landmark_id'])
            .ignore(); // bỏ qua nếu đã tồn tại
    
        return progress;
    }    
}