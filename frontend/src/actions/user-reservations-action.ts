"use server";

import { cookies } from "next/headers";
import { getUserIdFromToken } from "@/lib/jwt";

// Types pour les réservations
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
    // Vérification de l'authentification côté serveur
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;    if (!token) {
      return {
        reservations: [],
        confirmedReservations: [],
        pendingReservations: [],
        error: "Authentication required. Please login first.",
        success: false,
      };
    }

    // Extraction de l'userId en utilisant la fonction utilitaire
    const userId = getUserIdFromToken(token);
      if (!userId) {
      return {
        reservations: [],
        confirmedReservations: [],
        pendingReservations: [],
        error: "Authentication expired or invalid. Please login again.",
        success: false,
      };
    }

    // Appel à l'API backend pour récupérer les réservations
    const response = await fetch(`http://localhost:3001/api/reservations/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });    // Gestion des erreurs HTTP
    if (response.status === 401) {
      return {
        reservations: [],
        confirmedReservations: [],
        pendingReservations: [],
        error: "Authentication expired. Please login again.",
        success: false,
      };
    }

    if (response.status === 404) {
      // Pas de réservations trouvées - ce n'est pas une erreur
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
      };
    }    // Traitement de la réponse réussie
    const data = await response.json();
    console.log("Fetched Reservations:", data);
    
    // Extraire les réservations confirmées et en attente
    const confirmedReservations = Array.isArray(data.confirmedReservations) ? data.confirmedReservations : [];
    const pendingReservations = Array.isArray(data.pendingReservations) ? data.pendingReservations : [];
    
    // Combiner toutes les réservations pour la compatibilité
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
 * Fonction wrapper côté client pour appeler la server action
 * Peut être utilisée dans les useEffect et autres hooks côté client
 */
export async function getUserReservationsClient(): Promise<UserReservationsState> {
  return await getUserReservations();
}
