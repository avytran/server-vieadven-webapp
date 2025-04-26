import db from '../utils/db.util';

export default {
    updateGameplay: async (player_id: string, landmark_id: string, newScore: number) => {
        // 1. Lấy gameplay hiện tại
        const gameplay = await db('gameplay')
            .where({ user_id: player_id, landmark_id })
            .first();

        if (gameplay && newScore <= gameplay.score)
            return { message: 'New score is not higher. No update performed.' }

        const landmark = await db('landmark')
            .where({ landmark_id: gameplay.landmark_id })
            .first();

        if (!landmark) throw new Error('Landmark not found')

        const totalQuestion = landmark.total_question
        const ratio = newScore / totalQuestion

        let star = 0;
        if (ratio >= 1) star = 3;
        else if (ratio >= 2 / 3) star = 2;
        else if (ratio >= 1 / 3) star = 1;

        const updatedGameplay = await db('gameplay')
            .where({ user_id: player_id, landmark_id })
            .update({ score: newScore, star })
            .returning('*')

        return updatedGameplay;
    },
    getGameplayByUserIdAndProvinceId: async (province_id: string, user_id: string) => {
        const province = await db('province')
            .where({ province_id })
            .first();

        if (!province) throw new Error('Province not found');

        const landmarkIds = await db('landmark')
            .where({ province_id: province.province_id })
            .pluck('landmark_id'); // Lấy mảng landmark_id

        if (landmarkIds.length === 0) throw new Error('No landmark found');

        const gameplays = await db('gameplay')
            .join('landmark', 'gameplay.landmark_id', 'landmark.landmark_id')
            .select('gameplay.*', 'landmark.*')
            .where('gameplay.user_id', user_id)
            .whereIn('gameplay.landmark_id', landmarkIds);

        if (gameplays.length === 0) throw new Error('No gameplay found');

        return gameplays;
    }
}