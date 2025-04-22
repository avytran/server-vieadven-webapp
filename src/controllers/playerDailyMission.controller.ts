import { Request, Response } from 'express';

import playerDailyMissionService from '../services/playerDailyMission.service';
import { logger } from '../utils/log.util';

export default {
    getAllMissionsOfAPlayer: async (req: Request, res: Response) => {
        try {
            const missions = await playerDailyMissionService.getAllMissionsOfAPlayer();

            if (!missions) {
                logger.logWarning('getAllMissionsOfAPlayerService', 'No mission found', 404)
                res.status(404).json({
                    message: 'No mission found',
                })
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
    }
}