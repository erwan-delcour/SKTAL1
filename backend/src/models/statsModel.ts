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

