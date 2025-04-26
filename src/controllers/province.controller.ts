import { Request, Response } from "express";
import provinceService from "../services/province.service";

export default {
    getAllowedProvinces: async (req: Request, res: Response) => {
        const { player_id } = req.params;
        try {
            if (!player_id) {
                res.status(400).json({
                    message: 'playerId is required'
                })
                return;
            }

            const allowedProvinces = await provinceService.getAllowedProvinces(player_id)

            if (allowedProvinces.length === 0) {
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: allowedProvinces,
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error ' + error.message
            })
            return;
        }
    }
}