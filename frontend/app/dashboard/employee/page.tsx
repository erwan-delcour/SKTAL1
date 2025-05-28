"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {CalendarDays, CheckCircle, History} from "lucide-react"
import {DashboardShell} from "@/components/dashboard-shell";
import {ReservationCalendar} from "@/components/reservation-calendar";
import {ReservationsList} from "@/components/reservations-list";
import {ReservationHistory} from "@/components/reservation-history";
import {CheckInForm} from "@/components/check-in-form";
// Get today's date in the format "May 27, 2025"
const getTodayFormatted = () => {
    const today = new Date()
    return today.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})
}

export default function EmployeeDashboardPage() {
    const [activeTab, setActiveTab] = useState("reserve")
    const [reservations, setReservations] = useState([
        {
            id: 1,
            date: "May 27, 2025",
            spot: "A03",
            time: "Full day",
            isElectric: true,
        },
        {
            id: 2,
            date: "May 28, 2025",
            spot: "B07",
            time: "Morning",
            isElectric: false,
        },
    ])

    const [history, setHistory] = useState<{
        id: number;
        date: string;
        spot: string;
        status: "Completed" | "No Show" | "Cancelled";
    }[]>([
        {id: 101, date: "May 20, 2025", spot: "C05", status: "Completed"},
        {id: 102, date: "May 19, 2025", spot: "B03", status: "Completed"},
        {id: 103, date: "May 18, 2025", spot: "A01", status: "Completed"},
        {id: 104, date: "May 15, 2025", spot: "D07", status: "No Show"},
        {id: 105, date: "May 14, 2025", spot: "F02", status: "Completed"},
    ])

    const handleReservationCreated = (newReservation: {
        id: number;
        date: string;
        spot: string;
        time: string;
        isElectric: boolean
    }) => {
        setReservations([...reservations, newReservation])
    }

    const handleReservationCancelled = (reservationId: number) => {
        // Get the reservation before removing it
        const cancelledReservation = reservations.find((res) => res.id === reservationId)

        // Remove from active reservations
        setReservations(reservations.filter((res) => res.id !== reservationId))

        // Add to history as cancelled
        if (cancelledReservation) {
            setHistory([
                {
                    id: Date.now(),
                    date: cancelledReservation.date,
                    spot: cancelledReservation.spot,
                    status: "Cancelled",
                },
                ...history,
            ])
        }
    }

    const handleCheckIn = (reservationId: number, spotId: any) => {
        // Find the reservation
        const reservation = reservations.find((res) => res.id === reservationId)

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
    const activeReservationsCount = reservations.length
    const availableTodayCount = 15 // This would come from an API in a real app
    const electricSpotsCount = 8 // This would come from an API in a real app

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
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{activeReservationsCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    You have {activeReservationsCount} upcoming
                                    reservation{activeReservationsCount !== 1 ? "s" : ""}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Available Today</CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{availableTodayCount}</div>
                                <p className="text-xs text-muted-foreground">{availableTodayCount} spots available for
                                    today</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Electric Spots</CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{electricSpotsCount}</div>
                                <p className="text-xs text-muted-foreground">{electricSpotsCount} electric charging
                                    spots available</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Make a Reservation</CardTitle>
                                <CardDescription>Select dates and parking spot preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ReservationCalendar onReservationCreated={handleReservationCreated}/>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Your Reservations</CardTitle>
                                <CardDescription>View and manage your upcoming reservations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ReservationsList reservations={reservations}
                                                  onReservationCancelled={handleReservationCancelled}/>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="check-in" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Check-in to Your Spot</CardTitle>
                            <CardDescription>Scan the QR code at your parking spot or enter the spot ID
                                manually</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CheckInForm reservations={reservations} onCheckIn={handleCheckIn}/>
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
