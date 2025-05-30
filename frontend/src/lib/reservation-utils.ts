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

/**
 * Utility function to determine the status of a past reservation
 */
export function getHistoryReservationStatus(reservation: Reservation): "Completed" | "Cancelled" | "No Show" {
  // If the reservation was checked in, it's completed
  if (reservation.statusChecked || reservation.checkInTime) {
    return "Completed";
  }
  
  // For now, we don't have information about cancellations in the current structure
  // We return "No Show" by default for non-checked-in reservations
  return "No Show";
}

/**
 * Utility function to format the date of a history reservation
 */
export function formatHistoryDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (startDate === endDate) {
    return start.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    });
  } else {
    const startFormatted = start.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short'    });
    const endFormatted = end.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    });
    return `${startFormatted} - ${endFormatted}`;
  }
}

/**
 * Utility function to get the spot name
 */
export function getHistorySpotName(reservation: Reservation): string {
  if (reservation.spot) {
    return `${reservation.spot.row}${reservation.spot.spotNumber}`;
  }
  return "Not assigned";
}

/**
 * Utility function to format reservation date (general purpose)
 */
export function formatReservationDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = start.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  if (startDate === endDate) {
    return startFormatted;
  } else {
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${startFormatted} - ${endFormatted}`;
  }
}

/**
 * Utility function to get the spot name (general purpose)
 */
export function getReservationSpot(reservation: Reservation): string {
  if (reservation.spot) {
    return `${reservation.spot.row}${reservation.spot.spotNumber}`;
  }
  return "Pending assignment";
}

/**
 * Utility function to calculate reservation duration
 */
export function getReservationTime(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (daysDiff === 1) {
    return "Full day";
  } else {
    return `${daysDiff} days`;
  }
}
