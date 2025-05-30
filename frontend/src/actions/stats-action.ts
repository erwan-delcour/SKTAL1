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
  reservationsToday: number;
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
    const token = cookieStore.get("token")?.value;    if (!token) {
      return {
        availableToday: 0,
        electricSpots: 0,
        reservationsToday: 0,
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
    });    // Gestion des erreurs HTTP
    if (response.status === 401) {
      return {
        availableToday: 0,
        electricSpots: 0,
        reservationsToday: 0,
        error: "Authentication expired. Please login again.",
        success: false,
      };
    }

    if (!response.ok) {
      return {
        availableToday: 0,
        electricSpots: 0,
        reservationsToday: 0,
        error: `Failed to fetch stats (${response.status})`,
        success: false,
      };
    }

    // Traitement de la réponse réussie
    const data: TodayStats = await response.json();

    return {
      availableToday: data.totalFreeSpotsToday || 0,
      electricSpots: data.totalFreeChargerSpotsToday || 0,
      reservationsToday: data.totalReservationsToday || 0,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching today stats:", error);
    return {
      availableToday: 0,
      electricSpots: 0,
      reservationsToday: 0,
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

// Types pour les données des charts
export interface WeeklyOccupancyData {
  day: string;
  occupancy: number;
}

export interface HourlyUsageData {
  time: string;
  regular: number;
  electric: number;
}

export interface ExtendedStatsState {
  todayStats: StatsState;
  weeklyOccupancy: WeeklyOccupancyData[];
  hourlyUsage: HourlyUsageData[];
  averageOccupancy: number;
  noShowRate: number;
  electricUsagePercentage: number;
  error?: string;
  success: boolean;
}

/**
 * Server Action pour récupérer toutes les statistiques nécessaires au dashboard manager
 * Combine les vraies données du backend avec des données simulées pour les charts
 */
export async function getManagerDashboardStats(): Promise<ExtendedStatsState> {
  try {
    // Récupération des vraies données
    const todayStats = await getTodayStats();

    if (!todayStats.success) {
      return {
        todayStats,
        weeklyOccupancy: [],
        hourlyUsage: [],
        averageOccupancy: 0,
        noShowRate: 0,
        electricUsagePercentage: 0,
        error: todayStats.error,
        success: false,
      };
    }

    // Simulation de données historiques basées sur les vraies données du jour
    const totalSpots = 100; // Supposons 100 places au total
    const currentOccupancy = Math.round(((totalSpots - todayStats.availableToday) / totalSpots) * 100);
      // Génération de données hebdomadaires autour de l'occupancy actuelle
    const weeklyOccupancy: WeeklyOccupancyData[] = [
      { day: "Monday", occupancy: Math.max(15, Math.min(95, currentOccupancy - 15)) },
      { day: "Tuesday", occupancy: Math.max(15, Math.min(95, currentOccupancy - 8)) },
      { day: "Wednesday", occupancy: Math.max(15, Math.min(95, currentOccupancy - 3)) },
      { day: "Thursday", occupancy: Math.max(15, Math.min(95, currentOccupancy + 5)) },
      { day: "Friday", occupancy: Math.max(15, Math.min(95, currentOccupancy + 12)) },
      { day: "Saturday", occupancy: Math.max(15, Math.min(95, currentOccupancy - 25)) },
      { day: "Sunday", occupancy: Math.max(15, Math.min(95, currentOccupancy - 30)) },
    ];

    // Génération de données horaires basées sur des patterns réalistes
    const electricSpots = 20; // Supposons 20 places électriques
    const regularSpots = totalSpots - electricSpots;
    
    const hourlyUsage: HourlyUsageData[] = [];
    for (let hour = 0; hour < 24; hour += 2) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      
      // Pattern d'occupation réaliste selon l'heure
      let occupancyRate;
      if (hour >= 7 && hour <= 19) {
        // Heures de travail - plus d'occupation
        occupancyRate = 0.7 + (Math.sin((hour - 7) * Math.PI / 12) * 0.25);
      } else {
        // Nuit - moins d'occupation
        occupancyRate = 0.1 + (Math.random() * 0.2);
      }
      
      const regularUsed = Math.round(regularSpots * occupancyRate);
      const electricUsed = Math.round(electricSpots * (occupancyRate * 0.8)); // Les électriques un peu moins utilisées
      
      hourlyUsage.push({
        time: timeStr,
        regular: regularUsed,
        electric: electricUsed,
      });
    }

    // Calcul des métriques dérivées
    const averageOccupancy = Math.round(weeklyOccupancy.reduce((sum, day) => sum + day.occupancy, 0) / weeklyOccupancy.length);
    const noShowRate = Math.round(8 + (Math.random() * 8)); // Simule entre 8-16%
    const electricUsagePercentage = Math.round((todayStats.electricSpots / 20) * 100); // Sur 20 places électriques

    return {
      todayStats,
      weeklyOccupancy,
      hourlyUsage,
      averageOccupancy,
      noShowRate,
      electricUsagePercentage,
      success: true,
    };

  } catch (error) {
    console.error("Error fetching manager dashboard stats:", error);    return {
      todayStats: {
        availableToday: 0,
        electricSpots: 0,
        reservationsToday: 0,
        success: false,
        error: "Failed to load dashboard data",
      },
      weeklyOccupancy: [],
      hourlyUsage: [],
      averageOccupancy: 0,
      noShowRate: 0,
      electricUsagePercentage: 0,
      error: "Network error. Please check your connection and try again.",
      success: false,
    };
  }
}
