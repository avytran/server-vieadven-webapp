import db from '../utils/db.util'

export default {
    getAllMissionsOfAPlayer: async () => {
        const missions = await db('player_dailymission')
        .select('*')

        if(missions.length === 0)
            return null;

        return missions;
    },
    updateMissionProgessOfAPlayer: async (id: string, progress: number) => {
        const updatedMission = await db('player_dailymission')
        .where('user_id', id)
        .update({progress: progress})
        .returning('*')

        if(!updatedMission)
            return null;

        return updatedMission;
    }
}