import { Request, Response } from "express";
import feedbackService from "../services/feedback.service";

export default {
    getFeedbackById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const feedback = await feedbackService.getFeedbackById(Number(id));

            if (!feedback) {
                res.status(404).json({
                    message: "The feedback does not exist",
                    data: null,
                });
                return;
            }

            res.status(200).json({
                message: "Successfully retrieved feedback",
                data: feedback,
            });
            return;
        } catch (error) {
            console.error("Error retrieving feedback:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
            return;
        }
    },

    getAllFeedback: async (_req: Request, res: Response): Promise<void> => {
        try {
            const feedbacks = await feedbackService.getAllFeedback();

            if (!feedbacks || feedbacks.length === 0) {
                res.status(404).json({
                    message: "No feedback found!",
                    data: [],
                });
                return;
            }

            res.status(200).json({
                message: "Successfully retrieved all feedback",
                data: feedbacks,
            });
            return;
        } catch (error) {
            console.error("Error retrieving feedbacks:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
            return;
        }
    },

    createFeedback: async (req: Request, res: Response): Promise<void> => {
        const { content } = req.body;

        if (!content) {
            res.status(400).json({
                message: "Content is required",
            });
            return;
        }

        try {
            const createdFeedback = await feedbackService.createFeedback({ content });
            res.status(201).json({
                message: "The feedback is created successfully",
                data: createdFeedback,
            });
            return;
        } catch (error) {
            console.error("Error creating feedback:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
            return;
        }
    },

    deleteFeedbackById: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        try {
            const deletedCount = await feedbackService.deleteFeedback(Number(id));

            if (deletedCount === 0) {
                res.status(404).json({
                    message: "The feedback does not exist",
                });
                return;
            }

            res.status(200).json({
                message: "The feedback has been deleted successfully",
            });
            return;
        } catch (error) {
            console.error("Error deleting feedback:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
            return;
        }
    },


    updateFeedback: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            res.status(400).json({
                message: "Content is required",
            });
            return;
        }

        try {
            const updatedFeedback = await feedbackService.updateFeedback(Number(id), { content });

            if (!updatedFeedback) {
                res.status(404).json({
                    message: "Feedback not found or no changes applied",
                });
                return;
            }

            res.status(200).json({
                message: "The feedback is updated successfully",
                data: updatedFeedback,
            });
            return;
        } catch (error) {
            console.error("Error updating feedback:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
            return;
        }
    },
};