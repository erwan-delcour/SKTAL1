import { get } from "http";
import { getReservationsFromDB, cancelReservationInDB, createReservationInDB, updateReservationInDB } from "../models/reservationModel";
import { getUserById } from "../models/userModel";
import { Request, Response } from "express";
import { create } from "domain";


export const getReservations = async (req: Request, res: Response) => {
    try {
        const reservations = await getReservationsFromDB();
        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ message: "No reservations found" });
        }
        res.status(200).json(reservations);


    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getReservationById = async (req: Request, res: Response) => {
    const reservationId = req.params.id;
    try {
        const reservations = await getReservationsFromDB();
        const reservation = reservations.find(r => r._id === reservationId);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
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
        const reservations = await getReservationsFromDB();
        const userReservations = reservations.filter(r => r.user === userId);
        if (!userReservations || userReservations.length === 0) {
            return res.status(404).json({ message: "No reservations found for this user" });
        }
        res.status(200).json(userReservations);
    } catch (error) {
        console.error("Error fetching user reservations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelReservation = async (req: Request, res: Response) => {
    const reservationId = req.params.id;
    try {
        const reservations = await getReservationsFromDB();
        const reservationIndex = reservations.findIndex(r => r._id === reservationId);
        if (reservationIndex === -1) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Update the reservation status to 'cancelled'
        await cancelReservationInDB(reservations[reservationIndex]._id);

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
        return res.status(400).json({ message: "Missing required reservation fields" });
    }

   
    if (new Date(newReservation.startDate) >= new Date(newReservation.endDate)) {
        return res.status(400).json({ message: "Start date must be before end date" });
    }// date bonne 

    if (new Date(newReservation.startDate) < new Date()) {
        return res.status(400).json({ message: "Start date must be in the future" });
    }// date bonne future

    if (newReservation.spot.isAvailable === false) {
        return res.status(400).json({ message: "Selected parking spot is not available" });
    }// spot disponible

    if (user.role == 'user') {
        if (new Date(newReservation.startDate) >= new Date(newReservation.endDate)) {
        return res.status(400).json({ message: "Start date must be before end date" });
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
    try {
        const reservationId = req.params.id;
        const reservations = await getReservationsFromDB();
        const reservationIndex = reservations.findIndex(r => r._id === reservationId);
        
        if (reservationIndex === -1) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        await updateReservationInDB({
            ...reservations[reservationIndex],
            status: 'checked-in',
            checkInTime: new Date()
        });

        reservations[reservationIndex].status = 'checked-in';   
        reservations[reservationIndex].checkInTime = new Date();
        // Update the parking spot availability
        reservations[reservationIndex].spot.isAvailable = false;


        res.status(200).json(reservations[reservationIndex]);
    }
    catch (error) {
        console.error("Error checking in reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};