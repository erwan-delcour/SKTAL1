import pool from "../db/dbConfig";

export async function getReservationFromTodayFromDB(): Promise<number> {
    const query = `
        SELECT COUNT(*) AS total_reservations_today
        FROM reservations
        WHERE DATE(startDate) = CURRENT_DATE
    `;
    return pool.query(query)
        .then(result => {
            if (result.rows.length === 0) {
                return 0;
            }
            return parseInt(result.rows[0].total_reservations_today, 10);
        })
        .catch(error => {
            console.error('Error fetching today\'s reservations:', error);
            throw error;
        });
}

export async function getTodayFreeSpotsCountFromDB(): Promise<number> {
    const query = `
        SELECT COUNT(*) AS total_free_spots_today
        FROM places
        WHERE isAvailable = true
          AND id NOT IN (
              SELECT spotId
              FROM reservations
              WHERE DATE(startDate) = CURRENT_DATE
          )
    `;
    return pool.query(query)
        .then(result => {
            if (result.rows.length === 0) {
                return 0; 
            }
            return parseInt(result.rows[0].total_free_spots_today, 10);
        })
        .catch(error => {
            console.error('Error fetching today\'s free spots:', error);
            throw error;
        });
}

export const getTodayFreeChargerSpotsCountFromDB = async (): Promise<number> => {
    const query = `
        SELECT COUNT(*) AS total_free_charger_spots_today
        FROM places
        WHERE isAvailable = true
          AND hasCharger = true
          AND id NOT IN (
              SELECT spotId
              FROM reservations
              WHERE DATE(startDate) = CURRENT_DATE
          )
    `;
    return pool.query(query)
        .then(result => {
            if (result.rows.length === 0) {
                return 0; 
            }
            return parseInt(result.rows[0].total_free_charger_spots_today, 10);
        })
        .catch(error => {
            console.error('Error fetching today\'s free charger spots:', error);
            throw error;
        });
}

export async function getAllPlacesStatusFromDB(): Promise<any[]> {
    const getAllSpotsQuery = `
        SELECT * from places
    `;
    const spots = await pool.query(getAllSpotsQuery);
    console.log(spots.rows[0]);
    if (!spots || spots.rows.length === 0) {
        throw new Error("No spots found");
    }
    const getTodayReservationQuery = `
        SELECT spotId, statuschecked FROM reservations
        WHERE DATE(startDate) = CURRENT_DATE
    `;
    const todayReservations = await pool.query(getTodayReservationQuery);
    console.log("Today reservations:", todayReservations.rows);
    for(const spot of spots.rows) {
        spot.isAvailable = true;
        spot.isReserved = false;
        spot.isCheckin = false;
        if (todayReservations.rows.some((reservation: any) => reservation.spotid === spot.id)) {
            spot.isAvailable = false;
            spot.isReserved = true;
            if (todayReservations.rows.some((reservation: any) => reservation.spotid === spot.id && reservation.statuschecked === true)) {
                console.log("Spot is checked:", spot.id);
                spot.isCheckin = true;
            }
        }
    }

    return spots.rows;
}
