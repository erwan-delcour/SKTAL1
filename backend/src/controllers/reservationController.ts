<<<<<<< HEAD
import { get } from "http";
import { getReservationsFromDB, cancelReservationInDB, createReservationInDB, updateReservationInDB, getReservationByIdFromDB } from "../models/reservationModel";
import { getUserById } from "../models/userModel";
import { Request, Response } from "express";
import { create } from "domain";
=======
import { getReservationsFromDB, cancelReservationInDB, createReservationInDB, updateReservationInDB, getReservationByIdFromDB, getReservationsByUserFromDB, checkedInReservationInDB, getReservationIdFromTodayBySpotid } from "../models/reservationModel";
import { getUserById } from "../models/userModel";
import { Request, Response } from "express";
>>>>>>> origin/backRendu3


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
<<<<<<< HEAD
        const reservations = await getReservationsFromDB();
        const userReservations = reservations.filter(r => r.userId === userId);
        if (!userReservations || userReservations.length === 0) {
            res.status(404).json({ message: "No reservations found for this user" });
            return;
        }
        res.status(200).json(userReservations);
    } catch (error) {
        console.error("Error fetching user reservations:", error);
        res.status(500).json({ message: "Internal server error" });
=======
        await getUserById(userId);
        const reservations = await getReservationsByUserFromDB(userId);
        res.status(200).json(reservations);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
>>>>>>> origin/backRendu3
    }
};

export const cancelReservation = async (req: Request, res: Response) => {
    const reservationId = req.params.id;
    try {
<<<<<<< HEAD
        const reservations = await getReservationsFromDB();
        const reservationIndex = reservations.findIndex(r => r.id === reservationId);
        if (reservationIndex === -1) {
=======
        const reservation = await getReservationByIdFromDB(reservationId);
        if (!reservation) {
>>>>>>> origin/backRendu3
            res.status(404).json({ message: "Reservation not found" });
            return;
        }

<<<<<<< HEAD
        await cancelReservationInDB(reservations[reservationIndex].id);

        res.status(200).json(reservations[reservationIndex]);
=======
        await cancelReservationInDB(reservation.id);

        res.status(200).json(reservation);
>>>>>>> origin/backRendu3
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createReservation = async (req: Request, res: Response) => {
    const newReservation = req.body;
<<<<<<< HEAD
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
=======

    try {
        const checkResult = await checkReservation(newReservation);

        if (!checkResult.valid) {
            res.status(400).json({ message: checkResult.message });
            return;
        }

        const createdReservation = await createReservationInDB(newReservation);
        res.status(201).json(createdReservation);
    } catch (error) {
>>>>>>> origin/backRendu3
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkedInReservation = async (req: Request, res: Response) => {
<<<<<<< HEAD
    try {
        const reservationId = req.params.id;
        const reservations = await getReservationsFromDB();
        const reservationIndex = reservations.findIndex(r => r.id === reservationId);
        
        if (reservationIndex === -1) {
            res.status(404).json({ message: "Reservation not found" });
            return
        }

        await updateReservationInDB({
            ...reservations[reservationIndex],
            statusChecked: true,
            checkInTime: new Date()
        });

        reservations[reservationIndex].statusChecked = true;
        reservations[reservationIndex].checkInTime = new Date();
        // Update the parking spot availability
        reservations[reservationIndex].spot.isAvailable = false;


        res.status(200).json(reservations[reservationIndex]);
    }
    catch (error) {
        console.error("Error checking in reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
=======
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

>>>>>>> origin/backRendu3
};