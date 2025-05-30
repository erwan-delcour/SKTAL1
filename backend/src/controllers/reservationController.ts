import { getReservationsFromDB, deleteReservationInDB, findAvailableSpot, createReservationInDB, updateReservationInDB, getReservationByIdFromDB, getReservationsByUserFromDB, checkedInReservationInDB, getReservationIdFromTodayBySpotid, checkReservation, refuseReservationInDB, createPendingReservationInDB, getPendingReservationsFromDB, getPendingReservationByIdFromDB } from "../models/reservationModel";
import { getUserById } from "../models/userModel";
import { Request, Response } from "express";
import pool from "../db/dbConfig";


export const getReservations = async (req: Request, res: Response) => {
    const userId = req.body.userId as string;
    try {

        const user = await getUserById(userId);
        if (!user) {
            res.status(403).json({ message: "User not found" });
        }

        if (!user.role || user.role !== "secretary") {
            res.status(403).json({ message: "Access denied" });
            return;
        }

        const reservations = await getReservationsFromDB();

        if (!reservations || reservations.length === 0) { 
            res.status(404).json({ message: "No reservations found" });
            return;
        }

        res.status(200).json(reservations);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPendingReservations = async (req: Request, res: Response) => {
    const userId = req.body.userId as string;
    console.log("getPendingReservations called with userId:", userId);
    try {

        const user = await getUserById(userId);
        if (!user) {
            res.status(403).json({ message: "User not found" });
        }

        const reservations = await getPendingReservationsFromDB();

        console.log("Pending reservations fetched:", reservations);

    
        if (!reservations || reservations.length === 0) { 
            res.status(404).json({ message: "No reservations found" });
            return;
        }

        res.status(200).json(reservations);
    } catch (error) {
        console.error("Error fetching all reservations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getReservationById = async (req: Request, res: Response) => {
    const reservationId = req.body.id;
    try {
        const reservation = await getReservationByIdFromDB(reservationId);
        if (!reservation) {
            res.status(404).json({ message: "Reservation not found" });
            return;
        }
        res.status(200).json(reservation);
    } catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getReservationsByUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    try {
        await getUserById(userId);
        const reservations = await getReservationsByUserFromDB(userId);
        res.status(200).json(reservations);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const deleteReservation = async (req: Request, res: Response) => {
    const reservationId = req.params.id;
    console.log(reservationId);
    let isPending = false;
    try {
        const query = `
            SELECT r.id, r.userId, r.needsCharger, r.startDate, r.endDate, r.statusChecked, r.checkInTime,
                p.id as spot_id, p.isAvailable, p.hasCharger, p.row, p.spotNumber
            FROM reservations r
            JOIN places p ON r.spotId = p.id
            WHERE r.id = $1
        `;
        let reservation: any = await pool.query(query, [reservationId])
        if (!reservation || reservation.rows.length === 0) {
            const queryPending = `SELECT * FROM reservationspending WHERE id = $1`
            reservation = await pool.query(queryPending, [reservationId]);
            if (!reservation || reservation.rows.length === 0) {
                res.status(404).json({ message: "Reservation not found" });
                return;
            }
            isPending = true;
        }
        reservation = reservation.rows[0];
        await deleteReservationInDB(reservationId, isPending);
        res.status(200).json(reservation);
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const refusePendingReservation = async (req: Request, res: Response) => {
    const reservationId = req.body.id;
    const userId = req.body.userId as string;
    if (!reservationId || !userId) {
        res.status(400).json({ message: "Reservation ID and User ID are required" });
        return;
    }
    try {

        const user = await getUserById(userId);
        if (!user) {
            res.status(403).json({ message: "User not found" });
        }

        if (!user.role || user.role !== "secretary") {
            res.status(403).json({ message: "Access denied need to be secretary" });
            return;
        }
        
        const reservation = await getReservationByIdFromDB(reservationId);
        if (!reservation) {
            res.status(404).json({ message: "Reservation not found" });
            return;
        }

        if (!reservation.id) {
            res.status(400).json({ message: "Reservation ID is missing" });
            return;
        }
        await refuseReservationInDB(reservation.id);

        res.status(200).json(reservation);
    } catch (error) {
        console.error("Error refusing reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createReservation = async (req: Request, res: Response) => {
    const pendingReservationId = req.body.pendingReservationId;

    try {
        
        const pending = await getPendingReservationByIdFromDB(pendingReservationId);
        if (!pending) {
            res.status(404).json({ message: "Pending reservation not found" });
            return;
        }

       
        const spot = await findAvailableSpot(pending.startDate, pending.endDate, pending.needsCharger);
        if (!spot) {
            res.status(409).json({ message: "No available parking spot for the requirements" });
            return;
        }

        const newReservation = {
            userId: pending.userId,
            spot: spot,
            needsCharger: pending.needsCharger,
            startDate: pending.startDate,
            endDate: pending.endDate,
            statusChecked: false,
            checkInTime: undefined
        };

        const checkResult = await checkReservation(newReservation);

        if (!checkResult.valid) {
            res.status(400).json({ message: checkResult.message });
            return;
        }

        const createdReservation = await createReservationInDB(newReservation, pendingReservationId);
        res.status(201).json(createdReservation);

    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const requestReservation = async (req: Request, res: Response) => {
    const newReservation = req.body;

    if (!newReservation.userId || !newReservation.startDate || !newReservation.endDate) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    const user = await getUserById(newReservation.userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    try {
        const createdReservation = await createPendingReservationInDB(newReservation);
        res.status(201).json(createdReservation);
    } catch (error) {
        console.error("Error creating reservation request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const checkedInReservation = async (req: Request, res: Response) => {
    const spotId = req.params.spotId;
    try {
        const reservationId = await getReservationIdFromTodayBySpotid(spotId);
        await checkedInReservationInDB(reservationId);
        res.status(200).json({ message: "Reservation checked in successfully" });
        return;
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
        return;
    }
};

export const patchReservation = async (req: Request, res: Response) => {
    const reservationId = req.params.id;
    const updatedReservationData = req.body;

    try{
        const actualReservation = await getReservationByIdFromDB(reservationId);
        if (!actualReservation) {
            res.status(404).json({ message: "Reservation not found" });
            return;
        }
        const updatedReservation = updateReservationInDB(updatedReservationData);
        res.status(200).json(updatedReservation);    

    }
    catch (error) {
        console.error("Error updating reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};


export const getReservationBySpotId = async (req: Request, res: Response) => {
    const spotId = req.params.spotId;
    try {
        const reservation = await getReservationIdFromTodayBySpotid(spotId);
        if (!reservation) {
            res.status(404).json({ message: "No reservation found for this spot today" });
            return;
        }
        res.status(200).json(reservation);
    } catch (error) {
        console.error("Error fetching reservation by spot ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};