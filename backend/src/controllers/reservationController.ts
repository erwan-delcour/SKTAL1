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
        const reservation = await getReservationByIdFromDB(reservationId);
        if (!reservation) {
            res.status(404).json({ message: "Reservation not found" });
            return;
        }

        await cancelReservationInDB(reservation.id);

        res.status(200).json(reservation);
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createReservation = async (req: Request, res: Response) => {
    const newReservation = req.body;

    try {
        const checkResult = await checkReservation(newReservation);

        if (!checkResult.valid) {
            res.status(400).json({ message: checkResult.message });
            return;
        }

        const createdReservation = await createReservationInDB(newReservation);
        res.status(201).json(createdReservation);
    } catch (error) {
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