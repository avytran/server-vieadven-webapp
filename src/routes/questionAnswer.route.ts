import express from 'express';
import questionAnswerController from '../controllers/questionAnswer.controller';
import authGuard from '../middlewares/authGuard.mdw';

const router = express.Router();
router.get('/:landmark_id/questions', authGuard.validateToken, questionAnswerController.getQuestions);

export default router;