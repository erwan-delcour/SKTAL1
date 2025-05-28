import { Request, Response } from 'express';
import pool from '../db/dbConfig';
import { getReservationFromTodayFromDB, getTodayFreeChargerSpotsCountFromDB, getTodayFreeSpotsCountFromDB } from '../models/statsModel';

export const getActualParkingStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const todayReservations = await getReservationFromTodayFromDB();
        const todayFreeSpots = await getTodayFreeSpotsCountFromDB();
        const todayFreeChargerSpots = await getTodayFreeChargerSpotsCountFromDB();
        res.status(200).json({ totalReservationsToday: todayReservations, totalFreeSpotsToday: todayFreeSpots, totalFreeChargerSpotsToday: todayFreeChargerSpots });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
