"use server";

import { cookies } from "next/headers";

/**
 * Server Action pour annuler une réservation
 */
export async function cancelUserReservation(reservationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Vérification de l'authentification côté serveur
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please login first.",
      };
    }

    // Validation du reservationId
    if (!reservationId || reservationId.trim() === "") {
      return {
        success: false,
        error: "Reservation ID is required.",
      };
    }

    // Appel à l'API backend pour annuler la réservation
    const response = await fetch(`http://localhost:3001/api/reservations/cancel/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Gestion des erreurs HTTP
    if (response.status === 401) {
      return {
        success: false,
        error: "Authentication expired. Please login again.",
      };
    }

    if (response.status === 404) {
      return {
        success: false,
        error: "Reservation not found or already cancelled.",
      };
    }

    if (response.status === 400) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Invalid reservation data.",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to cancel reservation (${response.status})`,
      };
    }

    // Traitement de la réponse réussie
    return {
      success: true,
    };

  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
}
