import db from '../utils/db.util';
import { dailyMission } from '../types/dailyMission';

export default {
    getAllMissionsOfAPlayer: async (player_id) => {
        const missions = await db('player_dailymission')
        .where('user_id', player_id)
        .join('daily_mission', 'player_dailymission.mission_id', '=', 'daily_mission.mission_id')
        .select('player_dailymission.*', 'daily_mission.*')

        if(missions.length === 0)
            return null;

        return missions;
    },
    updateMissionProgessOfAPlayer: async (player_id: string, mission_id: string, updatedItem: dailyMission) => {
        const updatedMission = await db('player_dailymission')
        .where('user_id', player_id)
        .andWhere('mission_id', mission_id)
        .update(updatedItem)
        .returning('*')

        if(!updatedMission)
            return null;

        return updatedMission;
    }
}