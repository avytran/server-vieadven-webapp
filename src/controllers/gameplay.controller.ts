import { Request, Response } from 'express';

import gameplayService from '../services/gameplay.service';

export default {
    updateGameplay: async (req: Request, res: Response) => {
        const { player_id, landmark_id, score } = req.body;

        try {
            if (!player_id || !landmark_id || typeof score !== 'number') {
                res.status(400).json({ error: 'Missing or invalid parameters' });
                return;
            }

            const result = await gameplayService.updateGameplay(player_id, landmark_id, score);

            res.status(200).json({
                message: 'Gameplay updated successfully',
                data: result,
            });
            return;
        } catch (error) {
            console.log('Error updating gameplay:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
            return;
        }
    }
};
