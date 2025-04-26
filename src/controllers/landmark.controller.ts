import { Request, Response } from 'express';
import landmarkService from '../services/landmark.service';

export default {
    getLandmarkById: async (req: Request, res: Response) => {
        try {
            const { landmark_id } = req.params;
            const landmark = await landmarkService.getLandmarkById(landmark_id);

            if (!landmark) {
                res.status(404).json({
                    message: 'Not found',
                });
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: landmark,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error' + " " + error.message,
            });
        }
    },
    getLandmarksByProvinceId: async (req: Request, res: Response) => {
        try {
            const { province_id } = req.params;
            const landmarks = await landmarkService.getLandmarksByProvinceId(province_id);

            if (landmarks.length === 0) {
                res.status(404).json({
                    message: 'No landmarks found',
                });
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: landmarks,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error' + " " + error.message,
            });
        }
    }

}