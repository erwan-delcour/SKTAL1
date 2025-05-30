"use server";

import { cookies } from "next/headers";
import { getUserIdFromToken, getRoleFromToken } from "@/lib/jwt";

export interface ReservationFormState {
  message: string
  success: boolean
}

/**
 * Action serveur pour créer une réservation de parking
 */
export async function createParkingReservation(
  prevState: ReservationFormState,
  formData: FormData
): Promise<ReservationFormState> {
  // Extraction des données du formulaire
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const numDays = parseInt(formData.get("numDays") as string) || 1;
  const needsCharging = formData.get("needsCharging") === "true";

  // Validation des données
  if (!startDate || !endDate) {
    return {
      message: "Please select a date range for your reservation.",
      success: false,
    };
  }
  if (numDays < 1) {
    return {
      message: "Please select at least 1 day for your reservation.",
      success: false,
    };
  }

  try {
    // Vérification de l'authentification
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        message: "Authentication required. Please login first.",
        success: false,
      };
    }

    // Déterminer la limite de jours basée sur le rôle de l'utilisateur
    const userRole = getRoleFromToken(token);
    const maxDays = userRole === "manager" ? 30 : 5;
    
    if (numDays > maxDays) {
      const roleText = userRole === "manager" ? "manager" : "employee";
      return {
        message: `As a ${roleText}, you can reserve parking for up to ${maxDays} days maximum.`,
        success: false,
      };
    }

    // Préparation des données
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return {
        message: "Authentication expired or invalid. Please login again.",
        success: false,
      };
    }
    
    const reservationPayload = {
      userId,
      startDate,
      endDate,
      needsCharger: needsCharging,
    };

    // Appel unique à l'API backend
    const response = await fetch("http://localhost:3001/api/reservations/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(reservationPayload),
    });

    // Gestion des erreurs HTTP
    if (response.status === 500) {
      return {
        message: "Internal server error. Please try again later.",
        success: false,
      };
    }

    if (response.status === 401) {
      return {
        message: "Authentication expired. Please login again.",
        success: false,
      };
    }

    if (!response.ok) {
      let errorMessage = "Failed to create reservation.";
      
      try {
        // Vérifier si la réponse est du JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          // Si ce n'est pas du JSON (probablement du HTML d'erreur), utiliser le statut
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
      } catch (parseError) {
        // Si on ne peut pas parser la réponse, utiliser le statut HTTP
        errorMessage = `Request failed with status ${response.status}`;
      }
      
      return {
        message: errorMessage,
        success: false,
      };
    }

    // Traitement de la réponse réussie
    const responseData = await response.json();
    
    // Message de succès selon le nombre de jours
    const message = numDays === 1 
      ? `Your parking reservation request has been submitted for ${startDate}.`
      : `Your parking reservation request has been submitted for ${numDays} days (${startDate} to ${endDate}).`;

    return {
      message,
      success: true,
    };

  } catch (error) {
    console.error("Reservation creation error:", error);
    return {
      message: "Network error. Please check your connection and try again.",
      success: false,
    };
  }
}
