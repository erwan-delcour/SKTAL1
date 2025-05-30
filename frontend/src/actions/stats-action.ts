"use server";

import { cookies } from "next/headers";

// Types pour les statistiques du jour
export interface TodayStats {
  totalReservationsToday: number;
  totalFreeSpotsToday: number;
  totalFreeChargerSpotsToday: number;
}

export interface StatsState {
  availableToday: number;
  electricSpots: number;
  error?: string;
  success: boolean;
}

/**
 * Server Action pour récupérer les statistiques du jour
 */
export async function getTodayStats(): Promise<StatsState> {
  try {
    // Vérification de l'authentification côté serveur
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        availableToday: 0,
        electricSpots: 0,
        error: "Authentication required. Please login first.",
        success: false,
      };
    }

    // Appel à l'API backend pour récupérer les statistiques
    const response = await fetch(`http://localhost:3001/api/stats/today`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Gestion des erreurs HTTP
    if (response.status === 401) {
      return {
        availableToday: 0,
        electricSpots: 0,
        error: "Authentication expired. Please login again.",
        success: false,
      };
    }

    if (!response.ok) {
      return {
        availableToday: 0,
        electricSpots: 0,
        error: `Failed to fetch stats (${response.status})`,
        success: false,
      };
    }

    // Traitement de la réponse réussie
    const data: TodayStats = await response.json();

    return {
      availableToday: data.totalFreeSpotsToday || 0,
      electricSpots: data.totalFreeChargerSpotsToday || 0,
      success: true,
    };

  } catch (error) {
    console.error("Error fetching today stats:", error);
    return {
      availableToday: 0,
      electricSpots: 0,
      error: "Network error. Please check your connection and try again.",
      success: false,
    };
  }
}

/**
 * Fonction wrapper côté client pour appeler la server action
 * Peut être utilisée dans les useEffect et autres hooks côté client
 */
export async function getTodayStatsClient(): Promise<StatsState> {
  return await getTodayStats();
}
