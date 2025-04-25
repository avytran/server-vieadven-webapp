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
    }
}