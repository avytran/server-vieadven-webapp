import { Router } from "express";
import missionController from "../controllers/mission.controller";
import validate from "../middlewares/validate.mdw";
import { createMissionSchema, updateMissionSchema } from "../entities/mission.entity";
const router = Router();


router.post("/", validate(createMissionSchema), missionController.createMission);


router.get("/", missionController.getAllMissions);


router.put("/:id", missionController.updateMission);


router.delete("/:id", validate(updateMissionSchema), missionController.deleteMission);

export default router;