"use server";

import { cookies } from "next/headers";
import { getUserIdFromToken } from "@/lib/jwt";

// Types for reservations
interface Reservation {
  id: string
  userId: string
  startDate: string
  endDate: string
  needsCharger: boolean
  statusChecked: boolean
  checkInTime?: string
  spot: {
    id: string
    row: string
    spotNumber: number
    hasCharger: boolean
    isAvailable: boolean
  }
}

export interface UserReservationsState {
  reservations: Reservation[]
  confirmedReservations: Reservation[]
  pendingReservations: Reservation[]
  error?: string
  success: boolean
}

/**
 * Server Action pour récupérer l'userId (secrétaire ou autre) depuis le cookie JWT côté serveur
 */
export async function getUserIdFromCookie(): Promise<{ userId: string | null, success: boolean, error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { userId: null, success: false, error: "Authentication required. Please login first." };
    }
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return { userId: null, success: false, error: "Authentication expired or invalid. Please login again." };
    }
    return { userId, success: true };
  } catch (error) {
    return { userId: null, success: false, error: "Network error. Please check your connection and try again." };
  }
}

/**
 * Server Action pour récupérer les réservations de l'utilisateur
 */
export async function getUserReservations(): Promise<UserReservationsState> {
  try {
    // Server-side authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;if (!token) {
      return {
        reservations: [],
        confirmedReservations: [],
        pendingReservations: [],
        error: "Authentication required. Please login first.",
        success: false,
      };
    }    // Extract userId using utility function
    const userId = getUserIdFromToken(token);
      if (!userId) {
      return {
        reservations: [],
        confirmedReservations: [],
        pendingReservations: [],
        error: "Authentication expired or invalid. Please login again.",
        success: false,
      };
    }    // Call backend API to retrieve reservations
    const response = await fetch(`http://localhost:3001/api/reservations/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle HTTP errors
    if (response.status === 401) {
      return {
        reservations: [],
        confirmedReservations: [],
        pendingReservations: [],
        error: "Authentication expired. Please login again.",
        success: false,
      };
    }    if (response.status === 404) {
      // No reservations found - this is not an error
      return {
        reservations: [],
        confirmedReservations: [],
        pendingReservations: [],
        success: true,
      };
    }

    if (!response.ok) {
      return {
        reservations: [],
        confirmedReservations: [],
        pendingReservations: [],
        error: `Failed to fetch reservations (${response.status})`,
        success: false,
      };    }

    // Process successful response
    const data = await response.json();
    
    // Extract confirmed and pending reservations
    const confirmedReservations = Array.isArray(data.confirmedReservations) ? data.confirmedReservations : [];
    const pendingReservations = Array.isArray(data.pendingReservations) ? data.pendingReservations : [];    
    // Combine all reservations for compatibility
    const allReservations = [...confirmedReservations, ...pendingReservations];

    return {
      reservations: allReservations,
      confirmedReservations,
      pendingReservations,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return {
      reservations: [],
      confirmedReservations: [],
      pendingReservations: [],
      error: "Network error. Please check your connection and try again.",
      success: false,
    };
  }
}

/**
 * Client-side wrapper function to call the server action
 * Can be used in useEffect and other client-side hooks
 */
export async function getUserReservationsClient(): Promise<UserReservationsState> {
  return await getUserReservations();
}

/**
 * Server Action to retrieve user's past reservation history
 */
export async function getUserReservationHistory(): Promise<UserReservationsState> {
  try {
    // Retrieve all reservations
    const allReservationsResult = await getUserReservations();
    
    if (!allReservationsResult.success) {
      return allReservationsResult;
    }

    // Filter to keep only past reservations
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of current day

    const pastReservations = allReservationsResult.reservations.filter((reservation) => {
      const endDate = new Date(reservation.endDate);
      return endDate < today;
    });

    return {
      reservations: pastReservations,
      confirmedReservations: pastReservations.filter(r => allReservationsResult.confirmedReservations.some(c => c.id === r.id)),
      pendingReservations: pastReservations.filter(r => allReservationsResult.pendingReservations.some(p => p.id === r.id)),
      success: true,
    };
  } catch (error) {
    console.error("Error fetching reservation history:", error);
    return {
      reservations: [],
      confirmedReservations: [],
      pendingReservations: [],
      error: "Network error. Please check your connection and try again.",
      success: false,
    };
  }
}

/**
 * Client-side wrapper function to call the history server action
 */
export async function getUserReservationHistoryClient(): Promise<UserReservationsState> {
  return await getUserReservationHistory();
}
