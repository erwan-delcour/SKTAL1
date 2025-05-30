import { Router } from "express";
import {
    getReservations,
    getReservationById,
    getReservationsByUser,
    createReservation,
    checkedInReservation,
    requestReservation,
    getPendingReservations,
    refusePendingReservation,
    deleteReservation
    
} from "../controllers/reservationController";

const router = Router();

router.get("/:id", getReservations);
router.get("/:id", getReservationById);
router.get("/user/:userId", getReservationsByUser);
router.get("/pending/list", getPendingReservations);
router.post("/checkin/:spotId", checkedInReservation);
router.post("/create", createReservation);
router.post("/request", requestReservation);
router.post("/refuse", refusePendingReservation);
router.delete("/cancel", deleteReservation);
export default router;