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


export async function getReservationsFromDB(): Promise<Reservation[]> {
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

export async function getReservationIdFromTodayBySpotid(spotid: string): Promise<string> {
    const query = `
        SELECT id
        FROM reservations
        WHERE DATE(startDate) = CURRENT_DATE AND spotId = $1
    `;
    return pool.query(query, [spotid])
        .then(result => {
            if (result.rows.length === 0) {
                throw new CustomError('No reservation found for today for this spot', 404);
            }
            const row = result.rows[0];
            return row.id; // Return the reservation ID
        })
        .catch(error => {
            throw new CustomError(error.message, 500);
        });
}

export async function getReservationByIdFromDB(reservationId: string): Promise<Reservation> {
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

export async function getReservationsByUserFromDB(userId: string): Promise<Reservation[]> {
    const query = `
        SELECT r.id, r.userId, r.needsCharger, r.startDate, r.endDate, r.statusChecked, r.checkInTime,
               p.id as spot_id, p.isAvailable, p.hasCharger, p.row, p.spotNumber
        FROM reservations r
        JOIN places p ON r.spotId = p.id
        WHERE r.userId = $1
    `;
    return pool.query(query, [userId])
        .then(result => {
            if (result.rows.length === 0) {
                throw new CustomError('No reservations found for this user', 404);
            }
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

export async function checkedInReservationInDB(reservationid: string): Promise<void> {
    const getReservation = await getStatusCheckedFromReservation(reservationid);
    if(getReservation) {
        throw new CustomError('Reservation already checked in', 400);
    }
    const query = `
        UPDATE reservations
        SET statusChecked = true, checkInTime = CURRENT_TIMESTAMP
        WHERE id = $1
    `;
    return pool.query(query, [reservationid])
        .then(() => {
            return;
        })
        .catch(error => {
            throw new CustomError(error.message, 500);
        });
}

export async function getStatusCheckedFromReservation(reservationId: string): Promise<boolean> {
    const query = `
        SELECT statusChecked
        FROM reservations
        WHERE id = $1
    `;
    return pool.query(query, [reservationId])
        .then(result => {
            if (result.rows.length === 0) {
                throw new CustomError('Reservation not found', 404);
            }
            return result.rows[0].statuschecked;
        })
        .catch(error => {
            throw new CustomError('Internal server error', 500);
        });
}