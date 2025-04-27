import { Router } from "express";
import authGuard from '../middlewares/authGuard.mdw';
import missionController from "../controllers/mission.controller";
import validate from "../middlewares/validate.mdw";
import { createMissionSchema, updateMissionSchema } from "../entities/mission.entity";
const router = Router();


router.post("/", authGuard.validateToken, validate(createMissionSchema), missionController.createMission);


router.get("/", authGuard.validateToken, missionController.getAllMissions);


router.put("/:id", authGuard.validateToken, missionController.updateMission);


router.delete("/:id", authGuard.validateToken, validate(updateMissionSchema), missionController.deleteMission);

export default router;