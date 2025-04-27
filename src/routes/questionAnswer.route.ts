import express from 'express';
import questionAnswerController from '../controllers/questionAnswer.controller';    

const router = express.Router();
router.get('/:landmark_id/questions', questionAnswerController.getQuestions);

export default router;