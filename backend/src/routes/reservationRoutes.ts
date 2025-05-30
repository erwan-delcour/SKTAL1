import { Router } from "express";
import {
    getReservations,
    getReservationById,
    getReservationsByUser,
    createReservation,
    checkedInReservation,
    requestReservation,
    getPendingReservations,
    refuseReservation,
    cancelReservation
    
} from "../controllers/reservationController";

const router = Router();

router.get("/:id", getReservations);
router.get("/:id", getReservationById);
router.get("/user/:userId", getReservationsByUser);
router.get("/pending/list", getPendingReservations);
router.post("/checkin/:spotId", checkedInReservation);
router.post("/create", createReservation);
router.post("/request", requestReservation);
router.post("/refuse", refuseReservation);
router.delete("/cancel/:id", cancelReservation);
export default router;