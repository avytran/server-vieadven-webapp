import db from '../utils/db.util'

export default {
    getAllMissionsOfAPlayer: async () => {
        const missions = await db('player_dailymission')
        .select('*')

        if(missions.length === 0)
            return null;

        return missions;
    }
}