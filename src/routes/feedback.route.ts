import { Router } from "express";
import feedbackController from "../controllers/feedback.controller";
import validate from "../middlewares/validate.mdw";
import { createFeedbackSchema, updateFeedbackSchema } from "../entities/feedback.entity";
import authGuard from '../middlewares/authGuard.mdw';

const router = Router();


router.post("/", authGuard.validateToken, validate(createFeedbackSchema), feedbackController.createFeedback);


router.get("/", authGuard.validateToken, feedbackController.getAllFeedback);


router.get("/:id", authGuard.validateToken, feedbackController.getFeedbackById);


router.put("/:id", authGuard.validateToken, validate(updateFeedbackSchema), feedbackController.updateFeedback);


router.delete("/:id", authGuard.validateToken, feedbackController.deleteFeedbackById);

export default router;