import { Request, Response } from "express";

import provinceProgressService from "../services/provinceProgress.service";

export default {
    getPlayerProvinceProgress: async (req: Request, res: Response) => {
        const { playerId, provinceId } = req.body;
        try {
            if (!playerId) {
                res.status(400).json({
                    message: 'playerId is required'
                })
                return;
            }
            if (!provinceId) {
                res.status(400).json({
                    message: 'provinceId is required'
                })
                return;
            }

            const playerProvinceProgress = await provinceProgressService.getPlayerProvinceProgress(playerId, provinceId)

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
        const playerId = req.query.playerId.toString()
        const provinceId = req.query.provinceId.toString()
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