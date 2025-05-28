import { Router } from "express";
import {
    getReservations,
    getReservationById,
    getReservationsByUser,
    checkedInReservation
} from "../controllers/reservationController";

const router = Router();

router.get("/", getReservations);
router.get("/:id", getReservationById);
router.get("/user/:userId", getReservationsByUser);
router.post("/checkin/:spotId", checkedInReservation);
export default router;