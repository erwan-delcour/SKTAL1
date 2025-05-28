import { ParkingPlace } from './parkingPlaceModel';
import pool from '../db/dbConfig'
import { CustomError } from '../utils/customError';

export default interface Reservation {
    id: string;
    userId: string;
    spot: ParkingPlace; // autre table
    needsCharger: boolean;
    startDate: Date;
    endDate: Date;
    statusChecked: boolean;
    checkInTime?: Date;
}


export function getReservationsFromDB(): Promise<Reservation[]> {
    const query = `
        SELECT r.id, r.userId, r.needsCharger, r.startDate, r.endDate, r.statusChecked, r.checkInTime,
               p.id as spot_id, p.isAvailable, p.hasCharger, p.row, p.spotNumber
        FROM reservations r
        JOIN places p ON r.spotId = p.id
    `;
    return pool.query(query)
        .then(result => {
            return result.rows.map(row => ({
                id: row.id,
                userId: row.userid,
                needsCharger: row.needscharger,
                startDate: row.startdate,
                endDate: row.enddate,
                statusChecked: row.statuschecked,
                checkInTime: row.checkintime,
                spot: {
                    id: row.spot_id,
                    isAvailable: row.isavailable,
                    hasCharger: row.hascharger,
                    row: row.row,
                    spotNumber: row.spotnumber
                }
            }) as Reservation);
        })
        .catch(error => {
            console.error('Error fetching reservations:', error);
            throw error;
        });
}

export function getReservationByIdFromDB(reservationId: string): Promise<Reservation> {
    const query = `
        SELECT r.id, r.userId, r.needsCharger, r.startDate, r.endDate, r.statusChecked, r.checkInTime,
               p.id as spot_id, p.isAvailable, p.hasCharger, p.row, p.spotNumber
        FROM reservations r
        JOIN places p ON r.spotId = p.id
        WHERE r.id = $1
    `;
    return pool.query(query, [reservationId])
        .then(result => {
            if( result.rows.length === 0) {
                throw new CustomError('Reservation not found', 404);
            }
            const row = result.rows[0];
            return {
                id: row.id,
                userId: row.userid,
                needsCharger: row.needscharger,
                startDate: row.startdate,
                endDate: row.enddate,
                statusChecked: row.statuschecked,
                checkInTime: row.checkintime,
                spot: {
                    id: row.spot_id,
                    isAvailable: row.isavailable,
                    hasCharger: row.hascharger,
                    row: row.row,
                    spotNumber: row.spotnumber
                }
            } as Reservation;
        })
        .catch(error => {
            console.error('Error fetching reservation by ID:', error);
            throw new CustomError('Internal server error', 500);
        });
}

export function cancelReservationInDB(reservationId: string): Promise<void> {
    return Promise.resolve();
}

export function createReservationInDB(reservation: Reservation): Promise<Reservation> {
    return Promise.resolve(reservation);
}

export function updateReservationInDB(reservation: Reservation): Promise<Reservation> {
    return Promise.resolve(reservation);
}