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
    },
    claim: async (mission_id: string, user_id: string) => {
        // 1. Kiểm tra mission có tồn tại và chưa được claim
        const mission = await db('player_dailymission')
          .where({ mission_id, user_id })
          .first();
      
        if (!mission) return null
        if (mission.claimed) throw new Error('Mission already claimed');
      
        // 2. Lấy item_id và reward_quantity từ bảng daily_mission
        const missionInfo = await db('daily_mission')
          .where({ mission_id: mission_id })
          .first();
      
        if (!missionInfo) throw new Error('Mission config not found');
      
        const { item_id, item_quantity } = missionInfo;
      
        // 3. Cập nhật claimed = true và iscompleted = true
        await db('player_dailymission')
          .where({ mission_id, user_id })
          .update({ is_completed: true, claimed: true });
      
        // 4. Kiểm tra item đã tồn tại trong player_item chưa
        const existingItem = await db('player_item')
          .where('player_id', user_id)
          .andWhere('item_id', item_id)
          .first();
      
        if (existingItem) {
          // 5a. Nếu có, tăng số lượng
          await db('player_item')
            .where('item_id', item_id)
            .andWhere('player_id', user_id)
            .update({
              quantity: existingItem.quantity + item_quantity,
            });
        } else {
          // 5b. Nếu chưa có, thêm mới
          await db('player_item').insert({
            user_id,
            item_id,
            quantity: item_quantity,
          });
        }
      
        // 6. Trả lại thông tin gameplay sau khi claim
        const updatedItems = await db('player_item')
          .where('player_id', user_id)
          .select();
      
        return {
          message: 'Mission claimed successfully',
          updatedItems,
        };
      }      
}