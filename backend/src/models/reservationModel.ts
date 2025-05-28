import { ParkingPlace } from './parkingPlaceModel';

export default interface Reservation {
  _id: string;
  user: string;
  spot: ParkingPlace;
  needsCharger: boolean;
  startDate: Date;
  endDate: Date;
  status: 'reserved' | 'checked-in' | 'cancelled';
  checkInTime?: Date;
}


export function getReservationsFromDB(): Promise<Reservation[]> {
  return Promise.resolve([]);
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