import { ParkingPlace } from './parkingPlaceModel';
import pool from '../db/dbConfig'
import { CustomError } from '../utils/customError';
import { getUserById } from "./userModel";

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
      if (result.rows.length === 0) {
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
  const query = `
        DELETE FROM reservations
        WHERE id = $1
    `;
  return pool.query(query, [reservationId])
    .then(() => {
      console.log(`Reservation ${reservationId} cancelled`);
    })
    .catch(error => {
      console.error('Error cancelling reservation:', error);
      throw new CustomError('Internal server error', 500);
    });
}

export function createReservationInDB(reservation: Reservation): Promise<Reservation> {
  console.log('Creating reservation:', reservation);

  const query = `
        INSERT INTO reservations (userId, spotId, needsCharger, startDate, endDate, checkInTime)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;
  const values = [
    reservation.userId,
    reservation.spot.id,
    reservation.needsCharger,
    reservation.startDate,
    reservation.endDate,
    reservation.checkInTime
  ];

  return pool.query(query, values)
    .then(result => {
      if (result.rows.length === 0) {
        throw new CustomError('Failed to create reservation', 500);
      }
      return { ...reservation, id: result.rows[0].id };
    })
    .catch(error => {
      console.error('Error creating reservation:', error);
      throw new CustomError('Internal server error', 500);
    });
}

export function getReservationsForSpotInPeriod(spotId: string, startDate: Date, endDate: Date): Promise<Reservation[]> {
  const query = `
        SELECT r.id, r.userId, r.needsCharger, r.startDate, r.endDate, r.statusChecked, r.checkInTime,
               p.id as spot_id, p.isAvailable, p.hasCharger, p.row, p.spotNumber
        FROM reservations r
        JOIN places p ON r.spotId = p.id
        WHERE r.spotId = $1
          AND r.startDate <= $3
          AND r.endDate >= $2
    `;
  return pool.query(query, [spotId, startDate, endDate])
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
      console.error('Error fetching reservations for spot in period:', error);
      throw error;
    });
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


//logique metier pour vérifier si la réservation est possible

export const checkReservation = async (newReservation: Reservation) => {
  if (!newReservation.userId || !newReservation.spot || !newReservation.startDate || !newReservation.endDate) {
    return { valid: false, message: "Missing required reservation fields" };
  }

  const start = new Date(newReservation.startDate);
  const end = new Date(newReservation.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, message: "Invalid date format" };
  }
  if (end < start) {
    return { valid: false, message: "End date cannot be before start date" };
  }

  const user = await getUserById(newReservation.userId);
  if (!user) {
    return { valid: false, message: "User not found" };
  }

  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
  if (user.role === 'user' && duration > 5) {
    return { valid: false, message: "Reservation can't exceed 5 days for regular users" };
  }
  if (user.role === 'manager' && duration > 30) {
    return { valid: false, message: "Reservation can't exceed 30 days for managers" };
  }

  const reservationsForSpot = await getReservationsForSpotInPeriod(
    newReservation.spot.id,
    start,
    end
  );

  if (reservationsForSpot && reservationsForSpot.length > 0) {
    return { valid: false, message: "Spot already reserved for this period" };
  }


  return { valid: true };
};