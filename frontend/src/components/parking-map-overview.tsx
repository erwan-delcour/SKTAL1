"use client"
import { useState, useEffect } from "react"
import { Zap, Car, User, CalendarDays, Clock, Loader2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSpotsStatusClient, type ParkingSpot } from "@/actions/spots-status-action"

interface ParkingMapOverviewProps {
  onSpotsLoad?: (spotsCount: number) => void;
}

const PARKING_ROWS = ["A", "B", "C", "D", "E", "F"]
const SPOTS_PER_ROW = 10

export function ParkingMapOverview({ onSpotsLoad }: ParkingMapOverviewProps) {
    const [spots, setSpots] = useState<ParkingSpot[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load spots status from API
    const loadSpots = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const result = await getSpotsStatusClient()
            
            if (result.success) {
                setSpots(result.spots)
                onSpotsLoad?.(result.spots.length)
            } else {
                setError(result.error || "Failed to load parking spots")
            }        } catch (err) {
            console.error("Error loading spots:", err)
            setError("Failed to load parking spots")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadSpots()
    }, [onSpotsLoad])

    const getSpotData = (spotId: string) => {
        return spots.find(spot => `${spot.row}${spot.spotnumber.toString().padStart(2, '0')}` === spotId)
    }

    const getSpotStatus = (spotId: string) => {
        const spotData = getSpotData(spotId)
        if (!spotData) {
            return { status: "unknown", spotData: null }
        }        // Handle API inconsistency - use camelCase if available, fallback to lowercase
        const isAvailable = spotData.isAvailable !== undefined ? spotData.isAvailable : spotData.isavailable
        const isReserved = spotData.isReserved !== undefined ? spotData.isReserved : spotData.isreserved
        const isCheckin = spotData.isCheckin !== undefined ? spotData.isCheckin : spotData.isCheckin        
        
        // Determine status based on availability, reservation and checking status
        if (isCheckin) {
            return { status: "checked-in", spotData } // Check-in terminé
        } else if (!isAvailable && isReserved) {
            return { status: "occupied-reserved", spotData } // Réservé et occupé (sans check-in)
        } else if (!isAvailable && !isReserved) {
            return { status: "occupied", spotData } // Occupé sans réservation
        } else if (isAvailable && isReserved) {
            return { status: "reserved", spotData } // Réservé mais pas encore arrivé
        } else {
            return { status: "available", spotData }
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Loading parking map...</p>
            </div>        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Car className="h-10 w-10 text-destructive mb-2" />
                <h3 className="text-lg font-medium text-destructive">Error Loading Parking Map</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
            </div>
        )
    }

    return (
        <TooltipProvider delayDuration={100}>
            <div className="overflow-auto p-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Parking Map Status</h3>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={loadSpots}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
                <div className="min-w-[800px] space-y-3">
                    {PARKING_ROWS.map((row) => (
                        <div key={row} className="flex items-center gap-3">
                            <div className="font-bold text-lg w-6 text-center">{row}</div>
                            <div className="flex flex-1 gap-1.5">                                {Array.from({ length: SPOTS_PER_ROW }).map((_, i) => {
                                    const spotNumber = (i + 1).toString().padStart(2, "0")
                                    const spotId = `${row}${spotNumber}`
                                    const isElectricRow = row === "A" || row === "F"
                                    const { status, spotData } = getSpotStatus(spotId)

                                    let spotBgColor = "bg-green-100 hover:bg-green-200" // Available
                                    let spotTextColor = "text-green-700"
                                    let spotBorderColor = "border-green-300"

                                    if (status === "checked-in") {
                                        spotBgColor = "bg-blue-100 hover:bg-blue-200"
                                        spotTextColor = "text-blue-700"
                                        spotBorderColor = "border-blue-400"
                                    } else if (status === "reserved") {
                                        spotBgColor = "bg-yellow-100 hover:bg-yellow-200"
                                        spotTextColor = "text-yellow-700"
                                        spotBorderColor = "border-yellow-400"
                                    } else if (status === "occupied-reserved" || status === "occupied") {
                                        spotBgColor = "bg-red-100 hover:bg-red-200"
                                        spotTextColor = "text-red-700"
                                        spotBorderColor = "border-red-400"
                                    }
                                    
                                    // Pour les spots électriques (lignes A et F)
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
                                                >                                                    <div className="font-semibold text-sm">{spotId}</div>
                                                    {isElectricRow && <Zap className="h-4 w-4 mt-0.5 text-yellow-500" />}
                                                    {status !== "available" && (
                                                        <Badge variant="secondary" className="mt-1 text-xs px-1.5 py-0.5">
                                                            {status === "checked-in" ? "Checked In" : 
                                                             status === "reserved" ? "Reserved" : "Occupied"}
                                                        </Badge>
                                                    )}
                                                    {status === "available" && (
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1 text-xs px-1.5 py-0.5 border-green-500 text-green-700 bg-white"
                                                        >
                                                            Available
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TooltipTrigger><TooltipContent className="bg-background border shadow-lg p-3 rounded-md">
                                                <div className="space-y-1.5 text-sm">
                                                    <p className="font-semibold flex items-center">
                                                        <Car className="h-4 w-4 mr-2 text-primary" />
                                                        Spot: {spotId} {(spotData?.hascharger || isElectricRow) && "(Electric)"}
                                                    </p>
                                                    <p>
                                                        Status:{" "}                                                        <span                                                            className={cn(
                                                                "font-medium",
                                                                status === "available" && "text-green-600",
                                                                status === "reserved" && "text-yellow-600",
                                                                status === "checked-in" && "text-blue-600",
                                                                (status === "occupied-reserved" || status === "occupied") && "text-red-600",
                                                            )}
                                                        >
                                                            {status === "available" ? "Available" : 
                                                             status === "reserved" ? "Reserved" : 
                                                             status === "checked-in" ? "Checked In" : 
                                                             "Occupied"}
                                                        </span>
                                                    </p>
                                                    {spotData && (
                                                        <>
                                                            <hr className="my-1" />
                                                            <p className="text-xs text-muted-foreground">
                                                                Spot ID: {spotData.id}
                                                            </p>
                                                            {spotData.hascharger && (
                                                                <p className="text-xs text-blue-600 flex items-center">
                                                                    <Zap className="h-3 w-3 mr-1" />
                                                                    Electric charging available
                                                                </p>
                                                            )}
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
                </div>                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 pt-4 border-t">
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
                        <div className="w-4 h-4 rounded-sm bg-blue-100 border-2 border-blue-400"></div>
                        <span className="text-sm">Checked In</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-red-100 border-2 border-red-400"></div>
                        <span className="text-sm">Occupied (No Reservation)</span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
