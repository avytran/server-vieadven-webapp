import { Router } from "express";
import feedbackController from "../controllers/feedback.controller";
import validate from "../middlewares/validate.mdw";
import { createFeedbackSchema, updateFeedbackSchema } from "../entities/feedback.entity";

const router = Router();


router.post("/", validate(createFeedbackSchema), feedbackController.createFeedback);


router.get("/", feedbackController.getAllFeedback);


router.get("/:id", feedbackController.getFeedbackById);


router.put("/:id", validate(updateFeedbackSchema), feedbackController.updateFeedback);


router.delete("/:id", feedbackController.deleteFeedbackById);

export default router;