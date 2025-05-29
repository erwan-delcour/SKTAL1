import { Router } from "express";
import { getActualParkingStats } from "../controllers/statsController";

const router = Router();

router.get("/today", getActualParkingStats);

export default router;