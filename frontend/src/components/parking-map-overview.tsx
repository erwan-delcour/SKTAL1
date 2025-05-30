"use client"
import { Zap, Car, User, CalendarDays, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Reservation {
    id: number
    userId: string
    userName: string
    userDepartment: string
    date: string
    spot: string
    time: string
    isElectric: boolean
    status: "upcoming" | "active" | "completed" | "cancelled" // Added more statuses
    checkedIn: boolean
}

interface ParkingUser {
    id: string
    name: string
    email: string
    department: string
}

interface ParkingMapOverviewProps {
    reservations: Reservation[]
    users: ParkingUser[] // Assuming you might want to display user details
}

const PARKING_ROWS = ["A", "B", "C", "D", "E", "F"]
const SPOTS_PER_ROW = 10

export function ParkingMapOverview({ reservations }: ParkingMapOverviewProps) {
    const todayFormatted = format(new Date(), "MMM d, yyyy")

    const getSpotStatus = (spotId: string) => {
        // Find reservations for this spot for today
        const todaysReservationsForSpot = reservations.filter(
            (r) => r.spot === spotId && r.date === todayFormatted && r.status !== "cancelled",
        )

        if (todaysReservationsForSpot.length > 0) {
            const currentReservation = todaysReservationsForSpot.find((r) => r.status === "active" || r.status === "upcoming") // Prioritize active/upcoming
            if (currentReservation) {
                if (currentReservation.checkedIn) {
                    return { status: "occupied", reservation: currentReservation }
                }
                // Check if it's past 11 AM and not checked in (for auto-release logic - simplified here)
                // For simplicity, we'll just mark it as reserved if not checkedIn
                return { status: "reserved", reservation: currentReservation }
            }
        }
        return { status: "available", reservation: null }
    }

    return (
        <TooltipProvider delayDuration={100}>
            <div className="overflow-auto p-2">
                <div className="min-w-[800px] space-y-3">
                    {PARKING_ROWS.map((row) => (
                        <div key={row} className="flex items-center gap-3">
                            <div className="font-bold text-lg w-6 text-center">{row}</div>
                            <div className="flex flex-1 gap-1.5">
                                {Array.from({ length: SPOTS_PER_ROW }).map((_, i) => {
                                    const spotNumber = (i + 1).toString().padStart(2, "0")
                                    const spotId = `${row}${spotNumber}`
                                    const isElectricRow = row === "A" || row === "F"
                                    const { status, reservation } = getSpotStatus(spotId)

                                    let spotBgColor = "bg-green-100 hover:bg-green-200" // Available
                                    let spotTextColor = "text-green-700"
                                    let spotBorderColor = "border-green-300"

                                    if (status === "reserved") {
                                        spotBgColor = "bg-yellow-100 hover:bg-yellow-200"
                                        spotTextColor = "text-yellow-700"
                                        spotBorderColor = "border-yellow-400"
                                    } else if (status === "occupied") {
                                        spotBgColor = "bg-red-100 hover:bg-red-200"
                                        spotTextColor = "text-red-700"
                                        spotBorderColor = "border-red-400"
                                    }

                                    if (isElectricRow && status === "available") {
                                        spotBgColor = "bg-blue-100 hover:bg-blue-200"
                                        spotTextColor = "text-blue-700"
                                        spotBorderColor = "border-blue-300"
                                    }

                                    return (
                                        <Tooltip key={spotId}>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className={cn(
                                                        "w-full h-20 rounded-md flex flex-col items-center justify-center text-xs font-medium border-2 cursor-pointer transition-colors",
                                                        spotBgColor,
                                                        spotTextColor,
                                                        spotBorderColor,
                                                    )}
                                                >
                                                    <div className="font-semibold text-sm">{spotId}</div>
                                                    {isElectricRow && <Zap className="h-4 w-4 mt-0.5 text-yellow-500" />}
                                                    {status !== "available" && reservation && (
                                                        <Badge variant="secondary" className="mt-1 text-xs px-1.5 py-0.5">
                                                            {status === "occupied" ? "Occupied" : "Reserved"}
                                                        </Badge>
                                                    )}
                                                    {status === "available" && !isElectricRow && (
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1 text-xs px-1.5 py-0.5 border-green-500 text-green-700 bg-white"
                                                        >
                                                            Available
                                                        </Badge>
                                                    )}
                                                    {status === "available" && isElectricRow && (
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1 text-xs px-1.5 py-0.5 border-blue-500 text-blue-700 bg-white"
                                                        >
                                                            EV Available
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-background border shadow-lg p-3 rounded-md">
                                                <div className="space-y-1.5 text-sm">
                                                    <p className="font-semibold flex items-center">
                                                        <Car className="h-4 w-4 mr-2 text-primary" />
                                                        Spot: {spotId} {isElectricRow && "(Electric)"}
                                                    </p>
                                                    <p>
                                                        Status:{" "}
                                                        <span
                                                            className={cn(
                                                                "font-medium",
                                                                status === "available" && "text-green-600",
                                                                status === "reserved" && "text-yellow-600",
                                                                status === "occupied" && "text-red-600",
                                                            )}
                                                        >
                              {status === "available" ? "Available" : status === "reserved" ? "Reserved" : "Occupied"}
                            </span>
                                                    </p>
                                                    {reservation && (
                                                        <>
                                                            <hr className="my-1" />
                                                            <p className="flex items-center">
                                                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                                                Reserved by: {reservation.userName}
                                                            </p>
                                                            <p className="flex items-center">
                                                                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                                                                Date: {reservation.date}
                                                            </p>
                                                            <p className="flex items-center">
                                                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                                Time: {reservation.time.split(" (")[0]}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-green-100 border-2 border-green-300"></div>
                        <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-blue-100 border-2 border-blue-300"></div>
                        <span className="text-sm">EV Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-yellow-100 border-2 border-yellow-400"></div>
                        <span className="text-sm">Reserved</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-red-100 border-2 border-red-400"></div>
                        <span className="text-sm">Occupied (Checked-In)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Electric Charging Spot</span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
