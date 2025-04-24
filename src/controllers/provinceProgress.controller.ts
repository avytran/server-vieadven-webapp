import { Request, Response } from "express";

import provinceProgressService from "../services/provinceProgress.service";

export default {
    getAllProvincesOfAPlayer: async (req: Request, res: Response) => {
        const { player_id } = req.params;  
        try {
            if (!player_id) {
                res.status(400).json({
                    message: 'playerId is required'
                })
                return;
            }

            const playerProvinces = await provinceProgressService.getAllProvincesOfAPlayer(player_id)

            if (!playerProvinces) {
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: playerProvinces,
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error ' + error.message
            })
            return;
        }
    },
    getPlayerProvinceProgress: async (req: Request, res: Response) => {
        const { player_id, province_id } = req.params;
        try {
            if (!player_id) {
                res.status(400).json({
                    message: 'playerId is required'
                })
                return;
            }
            if (!province_id) {
                res.status(400).json({
                    message: 'provinceId is required'
                })
                return;
            }

            const playerProvinceProgress = await provinceProgressService.getPlayerProvinceProgress(player_id, province_id)

            if (!playerProvinceProgress) {
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: playerProvinceProgress,
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error ' + error.message
            })
            return;
        }
    },
    updateProvinceProgress: async (req: Request, res: Response) => {
        const playerId = req.params.playerId
        const provinceId = req.params.provinceId
        const provinceProgress = req.body;

        if (!playerId || !provinceId) {
            res.status(400).json({
                message: 'playerId and provinceId are required'
            })
        }

        try {
            const updatedProvinceProgress = await provinceProgressService.updateProvinceProgress(playerId, provinceId, provinceProgress)

            if (!updatedProvinceProgress) {
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: updatedProvinceProgress
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