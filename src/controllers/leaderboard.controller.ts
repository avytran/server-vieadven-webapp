import { Request, Response } from 'express';

import leaderboardService from '../services/leaderboard.service';
import { logger } from '../utils/log.util'

export default {
    getTop10: async (req: Request, res: Response) => {
        try {
            const top10 = await leaderboardService.getTop10();

            if (!top10) {
                logger.logWarning('leaderboardService', 'No user found', 404)
                res.status(404).json({
                    message: 'No user found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: top10,
            })
            return;
        } catch (error) {
            logger.logError('leaderboardService', 'Internal Server Error', error, 500)
            res.status(500).json({
                message: 'Internal Server Error' + " " + error.message
            })
            return;
        }
    },
    getRankById: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await leaderboardService.getRankById(id);

        try {
            if (!user) {
                logger.logWarning('leaderboardService', 'Not found', 404)
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: user
            })
            return;
        } catch (error) {
            logger.logError('leaderboardService', 'Internal Server Error', error, 500)
            res.status(500).json({
                message: 'Internal Server Error' + " " + error.message
            })
            return;
        }
    }
}