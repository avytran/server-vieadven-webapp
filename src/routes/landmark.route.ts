import express from 'express';
import landmarkController from '../controllers/landmark.controller';
import authGuard from '../middlewares/authGuard.mdw';
const router = express.Router();
router.get('/:landmark_id', authGuard.validateToken, landmarkController.getLandmarkById);
router.get('/province/:province_id', authGuard.validateToken, landmarkController.getLandmarksByProvinceId);

export default router;