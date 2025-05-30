export interface ParkingPlace {
    id: string;
    isAvailable: boolean;
    hasCharger: boolean;
    row: string;
    spotNumber: string;
}

export function getParkingPlaces(): Promise<ParkingPlace[] > | null {
   
    const query = `
        SELECT id, row, spotNumber, hasCharger
        FROM places
        WHERE id NOT IN (
              SELECT spotId
              FROM reservations
              WHERE DATE(startDate) = CURRENT_DATE
          )
    `;
    
    return null;
}
