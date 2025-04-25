import { Request, Response } from 'express';

import playerDailyMissionService from '../services/playerDailyMission.service';
import { logger } from '../utils/log.util';

export default {
    getAllMissionsOfAPlayer: async (req: Request, res: Response) => {
        try {
            const { player_id } = req.params;
            
            if (!player_id) {
                res.status(400).json({ message: 'Missing userId in query params' });
                return;
            }
            const missions = await playerDailyMissionService.getAllMissionsOfAPlayer(player_id);

            if (!missions) {
                logger.logWarning('getAllMissionsOfAPlayerService', 'No mission found', 404)
                res.status(404).json({
                    message: 'No mission found',
                })
                return;
            }
            res.status(200).json({
                message: 'Successfully',
                data: missions
            })
            return;
        } catch (error) {
            logger.logError('getAllMissionsOfAPlayerService',
                'Internal Server Error ' + error.message, error, 500)
            res.status(500).json({
                message: 'Internal Server Error' + " " + error.message
            })
            return;
        }
    },
    updateMissionProgessOfAPlayer: async (req: Request, res: Response) => {
        const { player_id, mission_id } = req.params;
        const updatedItem = req.body;

        try {
            const updatedMission = await playerDailyMissionService.updateMissionProgessOfAPlayer(player_id, mission_id, updatedItem)

            if(!updatedMission) {
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: updatedMission
            })
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Internal Server Error ' + error.message
            })
            return;
        }
    }
}