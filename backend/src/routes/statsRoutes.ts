import { Router } from "express";
import { getActualParkingStats, getSpotsStatus } from "../controllers/statsController";

const router = Router();

router.get("/today", getActualParkingStats);
router.get("/spots/status", getSpotsStatus); 

export default router;