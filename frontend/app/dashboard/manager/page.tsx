"use client";

import { useEffect, useState } from "react";
import {DashboardShell} from "@/components/dashboard-shell";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {CalendarDays, LineChart, Zap, History, Users, ParkingCircle} from "lucide-react";
import {ManagerParkingReservationForm} from "@/components/manager-parking-reservation-form";
import {ReservationsList} from "@/components/reservations-list";
import {OccupancyChart} from "@/components/occupancy-chart";
import {ElectricUsageChart} from "@/components/electric-usage-chart";
import { getManagerDashboardStats, ExtendedStatsState } from "@/actions/stats-action";
import { getUserReservationsClient } from "@/actions/user-reservations-action";

// Types pour les réservations de l'API
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

// Fonctions utilitaires pour adapter les données API
function formatReservationDate(startDate: string, endDate: string): string {
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

function getReservationSpot(reservation: Reservation): string {
  if (reservation.spot) {
    return `${reservation.spot.row}${reservation.spot.spotNumber}`;
  }
  return "Pending assignment";
}

function getReservationTime(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (daysDiff === 1) {
    return "Full day";
  } else {
    return `${daysDiff} days`;
  }
}

export default function ManagerDashboardPage() {
    const [stats, setStats] = useState<ExtendedStatsState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // État pour les réservations du manager
    const [managerReservations, setManagerReservations] = useState<Reservation[]>([])
    const [reservationsLoading, setReservationsLoading] = useState(false)
    const [reservationsError, setReservationsError] = useState<string | null>(null)

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const data = await getManagerDashboardStats();
                if (data.success) {
                    setStats(data);
                    setError(null);
                } else {
                    setError(data.error || "Failed to load dashboard data");
                }
            } catch (err) {
                console.error("Error loading dashboard stats:", err);
                setError("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    // Fonction pour charger les réservations du manager
    const loadManagerReservations = async () => {
        try {
            setReservationsLoading(true)
            setReservationsError(null)
            
            const result = await getUserReservationsClient()
            
            if (result.success) {
                setManagerReservations(result.reservations)
            } else {
                setReservationsError(result.error || "Failed to load reservations")
            }
            
        } catch (err) {
            console.error("Failed to load manager reservations:", err)
            setReservationsError(err instanceof Error ? err.message : "Failed to load reservations")
        } finally {
            setReservationsLoading(false)
        }
    }

    // Charger les réservations au montage du composant
    useEffect(() => {
        loadManagerReservations()
    }, [])

    // Transformer les données API vers le format attendu par ReservationsList
    const transformedReservations = Array.isArray(managerReservations) ? managerReservations.map(reservation => ({
        id: reservation.id, // Garder l'UUID comme string
        date: formatReservationDate(reservation.startDate, reservation.endDate),
        spot: getReservationSpot(reservation),
        time: getReservationTime(reservation.startDate, reservation.endDate),
        isElectric: reservation.needsCharger,
    })) : []

    const handleReservationCreated = async () => {
        // Rafraîchir les réservations après création d'une nouvelle réservation
        console.log("Manager reservation request submitted successfully")
        await loadManagerReservations()
    }

    const handleReservationCancelled = (reservationId: string) => {
        // Supprimer de la liste des réservations
        setManagerReservations(managerReservations.filter((res) => res.id !== reservationId))
    }

    if (loading) {
        return (
            <DashboardShell
                title="Manager Dashboard"
                description="View parking analytics and make reservations"
                userRole="Manager">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading dashboard data...</div>
                </div>
            </DashboardShell>
        );
    }

    if (error) {
        return (
            <DashboardShell
                title="Manager Dashboard"
                description="View parking analytics and make reservations"
                userRole="Manager">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-500">Error: {error}</div>
                </div>
            </DashboardShell>
        );
    }    return (
        <DashboardShell
            title="Manager Dashboard"
            description="View parking analytics and make reservations"
            userRole="Manager">
            <Tabs defaultValue="analytics" className="space-y-4">                <TabsList>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="reserve" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Reserve
                    </TabsTrigger>
                    <TabsTrigger value="my-reservations" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        My Reservations
                    </TabsTrigger>
                </TabsList>                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Reservations Today</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.todayStats.reservationsToday || 0}</div>
                                <p className="text-xs text-muted-foreground">Active reservations for today</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
                                <ParkingCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.todayStats.availableToday || 0}</div>
                                <p className="text-xs text-muted-foreground">Free parking spots today</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Electric Spots</CardTitle>
                                <Zap className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.todayStats.electricSpots || 0}</div>
                                <p className="text-xs text-muted-foreground">Free charging spots today</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
                                <LineChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.averageOccupancy || 0}%</div>
                                <p className="text-xs text-muted-foreground">Based on weekly data</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Weekly Occupancy</CardTitle>
                                <CardDescription>Parking lot usage over the past week</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <OccupancyChart data={stats?.weeklyOccupancy} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Electric Charging Usage</CardTitle>
                            <CardDescription>Utilization of electric charging spots</CardDescription>
                        </CardHeader>                        
                        <CardContent className="h-[300px]">
                            <ElectricUsageChart data={stats?.hourlyUsage} />
                        </CardContent>
                    </Card>
                    </div>                </TabsContent>
                <TabsContent value="reserve" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manager Reservation</CardTitle>
                            <CardDescription>Reserve a parking spot for up to 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ManagerParkingReservationForm onReservationCreated={handleReservationCreated} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="my-reservations" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{transformedReservations.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    You have {transformedReservations.length} upcoming reservation{transformedReservations.length !== 1 ? "s" : ""}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Reservations</CardTitle>
                            <CardDescription>View and manage your upcoming reservations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {reservationsLoading ? (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">Loading reservations...</p>
                                </div>
                            ) : reservationsError ? (
                                <div className="text-center py-4">
                                    <p className="text-red-500">Error: {reservationsError}</p>
                                </div>
                            ) : (
                                <ReservationsList 
                                    reservations={transformedReservations}
                                    onReservationCancelled={handleReservationCancelled}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    );
}
