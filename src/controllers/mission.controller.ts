import { Request, Response } from "express";
import missionService from "../services/mission.service";

export default {
    createMission: async (req: Request, res: Response): Promise<void> => {
        try {
            const mission = req.body;
            const newMission = await missionService.createMission(mission);
            res.status(201).json({
                message: "Mission created successfully",
                data: newMission,
            });
        } catch (error) {
            console.error("Error creating mission:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
        }
    },

    getAllMissions: async (_req: Request, res: Response): Promise<void> => {
        try {
            const missions = await missionService.getAllMissions();
            res.status(200).json({
                message: "Successfully retrieved all missions",
                data: missions,
            });
        } catch (error) {
            console.error("Error fetching missions:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
        }
    },

    updateMission: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const mission = req.body;

        try {
            const updatedMission = await missionService.updateMission(id, mission);

            if (!updatedMission) {
                res.status(404).json({
                    message: "Mission not found or no changes applied",
                });
                return;
            }

            res.status(200).json({
                message: "Mission updated successfully",
                data: updatedMission,
            });
        } catch (error) {
            console.error("Error updating mission:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
        }
    },

    deleteMission: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        try {
            const deletedCount = await missionService.deleteMission(id);

            if (deletedCount === 0) {
                res.status(404).json({
                    message: "Mission not found",
                });
                return;
            }

            res.sendStatus(204)
        } catch (error) {
            console.error("Error deleting mission:", error);
            res.status(500).json({
                message: "Internal Server Error: " + error.message,
            });
        }
    },
};