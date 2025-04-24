import db from '../utils/db.util'

export default {
    getAllMissionsOfAPlayer: async (userId) => {
        const missions = await db('player_dailymission')
        .where('user_id', userId)
        .join('daily_mission', 'player_dailymission.mission_id', '=', 'daily_mission.mission_id')
        .select('player_dailymission.*', 'daily_mission.*')

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