import db from '../utils/db.util';

export default {
    getRankById: async (id:) => {
       const Rank = await db('leaderboard')
       .join('User', 'leaderboard.player_id', '=', 'User.user_id')
       .select('leaderboard.leaderboard_id', 'leaderboard.player_id', 'leaderboard.total_score', 'leaderboard.rank', 'User.name', 'User.avatar_url')

    }
}