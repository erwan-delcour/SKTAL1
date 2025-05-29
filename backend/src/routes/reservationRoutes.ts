import { Router } from "express";
import {
    getReservations,
    getReservationById,
    getReservationsByUser,
    createReservation,
    checkedInReservation
} from "../controllers/reservationController";

const router = Router();

router.get("/", getReservations);
router.get("/:id", getReservationById);
router.get("/user/:userId", getReservationsByUser);
router.post("/checkin/:spotId", checkedInReservation);
router.post("/", createReservation);
export default router;