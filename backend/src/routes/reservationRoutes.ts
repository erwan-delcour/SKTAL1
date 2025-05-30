import { Router } from "express";
import {
    getReservations,
    getReservationById,
    getReservationsByUser,
    createReservation,
    checkedInReservation,
    requestReservation,
    getPendingReservations
    
} from "../controllers/reservationController";

const router = Router();

router.get("/:id", getReservations);
router.get("/:id", getReservationById);
router.get("/user/:userId", getReservationsByUser);
router.get("/pending/list", getPendingReservations);
router.post("/checkin/:spotId", checkedInReservation);
router.post("/create", createReservation);
router.post("/request", requestReservation);
export default router;