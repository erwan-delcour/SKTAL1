import { Router } from "express";
import {
    getReservations,
    getReservationById,
<<<<<<< HEAD
=======
    getReservationsByUser,
    createReservation,
    checkedInReservation
>>>>>>> origin/backRendu3
} from "../controllers/reservationController";

const router = Router();

router.get("/", getReservations);
router.get("/:id", getReservationById);
<<<<<<< HEAD

=======
router.get("/user/:userId", getReservationsByUser);
router.post("/checkin/:spotId", checkedInReservation);
router.post("/", createReservation);
>>>>>>> origin/backRendu3
export default router;