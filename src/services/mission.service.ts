import db from "../utils/db.util";

export default {
    createMission: async (mission: any) => {
        try {
            const newMission = await db("daily_mission")
                .insert(mission)
                .returning("*");
            return newMission[0];
        } catch (error) {
            console.error("Error creating mission:", error);
            throw new Error("Error creating mission: " + error.message);
        }
    },

    getAllMissions: async () => {
        try {
            const missions = await db("daily_mission").select("*");
            return missions;
        } catch (error) {
            console.error("Error fetching missions:", error);
            throw new Error("Error fetching missions: " + error.message);
        }
    },

    updateMission: async (mission_id: number, mission: any) => {
        try {
            const updatedMission = await db("daily_mission")
                .where({ mission_id: Number(mission_id) })
                .update(mission)
                .returning("*");
            return updatedMission.length > 0 ? updatedMission[0] : null;
        } catch (error) {
            console.error("Error updating mission:", error);
            throw new Error("Error updating mission: " + error.message);
        }
    },

    deleteMission: async (mission_id: number) => {
        try {
            const deletedCount = await db("daily_mission")
                .where({ mission_id })
                .del();
            return deletedCount;
        } catch (error) {
            console.error("Error deleting mission:", error);
            throw new Error("Error deleting mission: " + error.message);
        }
    },
};