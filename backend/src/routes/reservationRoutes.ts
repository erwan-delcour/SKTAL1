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
<<<<<<< HEAD
router.post("/refuse", refuseReservation);
router.delete("/cancel/:id", cancelReservation);
=======
router.post("/refuse", refusePendingReservation);
router.delete("/cancel", deleteReservation);
>>>>>>> origin/backRendu4
export default router;