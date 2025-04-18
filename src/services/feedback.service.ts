import db from "../utils/db.util";
import { Feedback } from "../types/feedback";

export default {
    getFeedbackById: async (id: number): Promise<Feedback | null> => {
        try {
            const feedback = await db("feedback")
                .select("*")
                .where("feedback_id", id);

            return feedback.length > 0 ? feedback[0] : null;
        } catch (error) {
            console.error(error);
            throw new Error("Error getting feedback: " + error.message);
        }
    },

    getAllFeedback: async (): Promise<Feedback[]> => {
        try {
            return await db("feedback").select("*");
        } catch (error) {
            console.error(error);
            throw new Error("Error getting all feedback: " + error.message);
        }
    },

    deleteFeedback: async (id: number): Promise<number> => {
        try {
            return await db("feedback")
                .where("feedback_id", id)
                .del();
        } catch (error) {
            console.error(error);
            throw new Error("Error deleting feedback: " + error.message);
        }
    },



    updateFeedback: async (id: number, feedback: Partial<Feedback>): Promise<Feedback | null> => {
        try {
            const updatedFeedback = await db("feedback")
                .where("feedback_id", id)
                .update(feedback)
                .returning("*");

            return updatedFeedback.length > 0 ? updatedFeedback[0] : null;
        } catch (error) {
            console.error(error);
            throw new Error("Error updating feedback: " + error.message);
        }
    },

    createFeedback: async (feedback: Omit<Feedback, "feedback_id" | "created_at">): Promise<Feedback> => {
        try {
            const newFeedback = await db("feedback")
                .insert(feedback)
                .returning("*");

            return newFeedback[0];
        } catch (error) {
            console.error(error);
            throw new Error("Error creating feedback: " + error.message);
        }
    },
};