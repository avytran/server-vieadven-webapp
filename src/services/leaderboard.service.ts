import db from '../utils/db.util';

export default {
    getTop10: async () => {
        const top10 = await db('leaderboard')
            .join('User', 'leaderboard.player_id', '=', 'User.user_id')
            .select('leaderboard_id', 'leaderboard.player_id', 'total_score', 'rank', 'User.name', 'User.avatar_url')
            .orderBy('rank', 'asc')
            .limit(10)

        if (top10.length === 0)
            return null;

        return top10;
    },
    getRankById: async (id: string) => {
        const user = await db('leaderboard')
            .join('User', 'leaderboard.player_id', '=', 'User.user_id')
            .select('leaderboard.leaderboard_id', 'leaderboard.player_id', 'leaderboard.total_score', 'leaderboard.rank', 'User.name', 'User.avatar_url')
            .where('leaderboard.player_id', id)

        if (user.length === 0)
            return null;

        return user;
    }
}