"use client"

import {useState, useEffect} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Skeleton} from "@/components/ui/skeleton"
import {CalendarDays, CheckCircle, History} from "lucide-react"
import {DashboardShell} from "@/components/dashboard-shell";
import {ParkingReservationForm} from "@/components/parking-reservation-form";
import {ReservationsList} from "@/components/reservations-list";
import {ReservationHistory} from "@/components/reservation-history";
import {CheckInForm} from "@/components/check-in-form";
import { getUserReservationsClient, type UserReservationsState } from "@/actions/user-reservations-action"
import { getTodayStatsClient, type StatsState } from "@/actions/stats-action"

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

// Composants pour les statistiques avec Suspense
function ActiveReservationsCard({ reservationsCount }: { reservationsCount: number }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{reservationsCount}</div>
                <p className="text-xs text-muted-foreground">
                    You have {reservationsCount} upcoming
                    reservation{reservationsCount !== 1 ? "s" : ""}
                </p>
            </CardContent>
        </Card>
    );
}

function ActiveReservationsSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-8 mb-2" />
                <Skeleton className="h-3 w-40" />
            </CardContent>
        </Card>
    );
}

function TodayStatsCards({ availableToday, electricSpots }: { availableToday: number; electricSpots: number }) {
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Today</CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{availableToday}</div>
                    <p className="text-xs text-muted-foreground">
                        {availableToday} spots available for today
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Electric Spots</CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{electricSpots}</div>
                    <p className="text-xs text-muted-foreground">
                        {electricSpots} electric charging spots available
                    </p>
                </CardContent>
            </Card>
        </>
    );
}

function TodayStatsSkeleton() {
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-8 mb-2" />
                    <Skeleton className="h-3 w-36" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-8 mb-2" />
                    <Skeleton className="h-3 w-44" />
                </CardContent>
            </Card>
        </>
    );
}

function TodayStatsContainer() {
    const [stats, setStats] = useState<{ availableToday: number; electricSpots: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const statsResult = await getTodayStatsClient();
                if (statsResult.success) {
                    setStats({
                        availableToday: statsResult.availableToday,
                        electricSpots: statsResult.electricSpots
                    });
                } else {
                    setError(statsResult.error || "Failed to load stats");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load stats");
            }
        };

        loadStats();
    }, []);

    if (error) {
        return (
            <>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Today</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-red-500">Error loading data</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Electric Spots</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-red-500">Error loading data</p>
                    </CardContent>
                </Card>
            </>
        );
    }

    if (!stats) {
        return <TodayStatsSkeleton />;
    }
    
    return (
        <TodayStatsCards 
            availableToday={stats.availableToday} 
            electricSpots={stats.electricSpots} 
        />
    );
}

export default function EmployeeDashboardPage() {
    const [activeTab, setActiveTab] = useState("reserve")
    
    // État pour les vraies réservations depuis l'API
    const [apiReservations, setApiReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)    // Transformer les données API vers le format attendu par ReservationsList
    const transformedReservations = Array.isArray(apiReservations) ? apiReservations.map(reservation => ({
        id: reservation.id, // Garder l'UUID comme string
        date: formatReservationDate(reservation.startDate, reservation.endDate),
        spot: getReservationSpot(reservation),
        time: getReservationTime(reservation.startDate, reservation.endDate),
        isElectric: reservation.needsCharger,
    })) : []

    // Get today's date in the format "May 27, 2025"
    const getTodayFormatted = () => {
        const today = new Date()
        return today.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})
    }

    const [history, setHistory] = useState<{
        id: number;
        date: string;
        spot: string;
        status: "Completed" | "No Show" | "Cancelled";
    }[]>([
        
    ])

    // Charger les réservations au montage du composant
    useEffect(() => {
        const loadReservations = async () => {
            try {
                setIsLoading(true)
                setLoadError(null)
                
                const result = await getUserReservationsClient()
                
                if (result.success) {
                    setApiReservations(result.reservations)
                } else {
                    setLoadError(result.error || "Failed to load reservations")
                }
                
            } catch (err) {
                console.error("Failed to load reservations:", err)
                setLoadError(err instanceof Error ? err.message : "Failed to load reservations")
            } finally {
                setIsLoading(false)
            }
        }

        loadReservations()
    }, [])

    const handleReservationCreated = async () => {
        // Rafraîchir les réservations après création d'une nouvelle demande
        console.log("Reservation request submitted successfully")
        try {
            const result = await getUserReservationsClient()
            if (result.success) {
                setApiReservations(result.reservations)
            }        } catch (err) {
            console.error("Failed to refresh reservations:", err)
        }
    }

    const handleReservationCancelled = (reservationId: string) => {
        // Get the reservation before removing it
        const cancelledReservation = transformedReservations.find((res) => res.id === reservationId)

        // Remove from API reservations
        setApiReservations(apiReservations.filter((res) => res.id !== reservationId))

        // Add to history as cancelled
        if (cancelledReservation) {
            setHistory([
                {
                    id: Date.now(),
                    date: cancelledReservation.date,
                    spot: cancelledReservation.spot,
                    status: "Cancelled",
                },                ...history,
            ])
        }
    }

    const handleCheckIn = (reservationId: string, spotId: any) => {
        // Find the reservation
        const reservation = transformedReservations.find((res) => res.id === reservationId)

        if (reservation) {
            // If the reservation is for today, mark it as completed in history
            if (reservation.date === getTodayFormatted()) {
                // Add to history as completed
                setHistory([
                    {
                        id: Date.now(),
                        date: reservation.date,
                        spot: reservation.spot,
                        status: "Completed",
                    },
                    ...history,
                ])
            }
        }
    }

    // Calculate stats for the dashboard
    const activeReservationsCount = transformedReservations.length

    return (
        <DashboardShell title="Employee Dashboard" description="Manage your parking reservations" userRole="Employee">
            <Tabs defaultValue="reserve" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="reserve" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4"/>
                        Reserve
                    </TabsTrigger>
                    <TabsTrigger value="check-in" className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4"/>
                        Check-in
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="h-4 w-4"/>
                        History
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="reserve" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            <ActiveReservationsSkeleton />
                        ) : (
                            <ActiveReservationsCard reservationsCount={activeReservationsCount} />
                        )}
                        <TodayStatsContainer />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Request a Reservation</CardTitle>
                                <CardDescription>Submit a parking reservation request for 1-5 days</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ParkingReservationForm onReservationCreated={handleReservationCreated}/>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Your Reservations</CardTitle>
                                <CardDescription>View and manage your upcoming reservations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="text-center py-4">
                                        <p className="text-muted-foreground">Loading reservations...</p>
                                    </div>
                                ) : loadError ? (
                                    <div className="text-center py-4">
                                        <p className="text-red-500">Error: {loadError}</p>
                                    </div>
                                ) : (
                                    <ReservationsList reservations={transformedReservations}
                                                      onReservationCancelled={handleReservationCancelled}/>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="check-in" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Check-in to Your Spot</CardTitle>
                            <CardDescription>Enter the spot ID
                                manually</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CheckInForm reservations={transformedReservations} onCheckIn={handleCheckIn}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reservation History</CardTitle>
                            <CardDescription>View your past parking reservations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReservationHistory history={history}/>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    )
}
