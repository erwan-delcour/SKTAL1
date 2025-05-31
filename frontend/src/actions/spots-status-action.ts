"use server";

import { cookies } from "next/headers";

// Types for parking spots
export interface ParkingSpot {
  id: string;
  row: string;
  spotnumber: number | string;
  hascharger: boolean;
  isavailable: boolean;
  isreserved: boolean;
  isCheckin: boolean;
  // Handle API inconsistency with camelCase vs lowercase
  isAvailable?: boolean;
  isReserved?: boolean;
}

export interface SpotsStatusState {
  spots: ParkingSpot[];
  error?: string;
  success: boolean;
}

/**
 * Server Action to retrieve parking spots status
 */
export async function getSpotsStatus(): Promise<SpotsStatusState> {
  try {
    // Server-side authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        spots: [],
        error: "Authentication required. Please login first.",
        success: false,
      };
    }

    // Call backend API to retrieve spots status
    const response = await fetch(`http://backend:3001/api/stats/spots/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle HTTP errors
    if (response.status === 401) {
      return {
        spots: [],
        error: "Authentication expired. Please login again.",
        success: false,
      };
    }

    if (!response.ok) {
      return {
        spots: [],
        error: `Failed to fetch spots status (${response.status})`,
        success: false,
      };
    }

    // Process successful response
    const data = await response.json();
    const spots = Array.isArray(data) ? data : [];

    return {
      spots,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching spots status:", error);
    return {
      spots: [],
      error: "Network error. Please check your connection and try again.",
      success: false,
    };
  }
}

/**
 * Client-side wrapper function to call the server action
 */
export async function getSpotsStatusClient(): Promise<SpotsStatusState> {
  return await getSpotsStatus();
}
