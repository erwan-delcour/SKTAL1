import { getReservationsFromDB, cancelReservationInDB, createReservationInDB, updateReservationInDB, getReservationByIdFromDB, getReservationsByUserFromDB, checkedInReservationInDB, getReservationIdFromTodayBySpotid } from "../models/reservationModel";
import { getUserById } from "../models/userModel";
import { Request, Response } from "express";


export const getReservations = async (req: Request, res: Response) => {
    try {
        const reservations = await getReservationsFromDB();
        if (!reservations || reservations.length === 0) {
            res.status(404).json({ message: "No reservations found" });
            return;
        }
        res.status(200).json(reservations);
        return;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getReservationById = async (req: Request, res: Response) => {
    const reservationId = req.params.id;
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
    try {
        await getUserById(userId);
        const reservations = await getReservationsByUserFromDB(userId);
        res.status(200).json(reservations);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const cancelReservation = async (req: Request, res: Response) => {
    const reservationId = req.params.id;
    try {
        const reservations = await getReservationsFromDB();
        const reservationIndex = reservations.findIndex(r => r.id === reservationId);
        if (reservationIndex === -1) {
            res.status(404).json({ message: "Reservation not found" });
            return;
        }

        await cancelReservationInDB(reservations[reservationIndex].id);

        res.status(200).json(reservations[reservationIndex]);
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createReservation = async (req: Request, res: Response) => {
    const newReservation = req.body;
    const userId = newReservation.user;
    const user = await getUserById(userId);

    if (!newReservation.user || !newReservation.spot || !newReservation.startDate || !newReservation.endDate) {
         res.status(400).json({ message: "Missing required reservation fields" });
         return;
    }

    
    if (new Date(newReservation.startDate) >= new Date(newReservation.endDate)) {
        res.status(400).json({ message: "Start date must be before end date" });
        return;
    }// date bonne 

    if (new Date(newReservation.startDate) < new Date()) {
        res.status(400).json({ message: "Start date must be in the future" });
        return;
    }// date bonne future

    if (newReservation.spot.isAvailable === false) {
        res.status(400).json({ message: "Selected parking spot is not available" });
        return;
    }// spot disponible

    if (user.role == 'user') {
        if (new Date(newReservation.startDate) >= new Date(newReservation.endDate)) {
            res.status(400).json({ message: "Start date must be before end date" });
            return;
        }
    }
    
    

    try {
        const createdReservation = await createReservationInDB(newReservation);
        res.status(201).json(createdReservation);
    }

    catch (error) {
        console.error("Error creating reservation:", error);
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