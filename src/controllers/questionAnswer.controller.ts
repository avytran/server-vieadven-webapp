import { Request, Response } from "express";
import questionAnswerService from "../services/questionAnswer.service";

export default {
    getQuestions: async (req: Request, res: Response) => {
        const { landmark_id } = req.params;
        try {
            const questions = await questionAnswerService.getQuestions(landmark_id);
            if (!questions) {
                res.status(404).json({ message: "No questions found for this landmark" });
                return;
            }
            res.status(200).json(questions);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }
}