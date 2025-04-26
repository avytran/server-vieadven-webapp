import express from 'express';
import landmarkController from '../controllers/landmark.controller';

const router = express.Router();
router.get('/:landmark_id', landmarkController.getLandmarkById);
router.get('/province/:province_id', landmarkController.getLandmarksByProvinceId);

export default router;