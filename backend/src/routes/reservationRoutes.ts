import { Router } from "express";
import {
    getReservations,
    getReservationById,
} from "../controllers/reservationController";

const router = Router();

router.get("/", getReservations);
router.get("/:id", getReservationById);

export default router;