"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Loader2, Car } from "lucide-react"
import { getSpotsStatusClient, type ParkingSpot } from "@/actions/spots-status-action"

const PARKING_ROWS = ["A", "B", "C", "D", "E", "F"]
const SPOTS_PER_ROW = 10

export function AdminParkingMap() {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [spots, setSpots] = useState<ParkingSpot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load spots status from API
  useEffect(() => {
    const loadSpots = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await getSpotsStatusClient()
        
        if (result.success) {
          setSpots(result.spots)
        } else {
          setError(result.error || "Failed to load parking spots")
        }
      } catch (err) {
        console.error("Error loading spots:", err)
        setError("Failed to load parking spots")
      } finally {
        setIsLoading(false)
      }
    }

    loadSpots()
  }, [])
  const getSpotData = (spotId: string) => {
    return spots.find(spot => `${spot.row}${spot.spotnumber.toString().padStart(2, '0')}` === spotId)
  }
  
  const getSpotStatus = (spotId: string) => {
    const spotData = getSpotData(spotId)
    if (!spotData) {
      return { status: "unknown", spotData: null }
    }    // Handle API inconsistency - use camelCase if available, fallback to lowercase
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

  const handleSpotClick = (spotId: string) => {
    setSelectedSpot(spotId)
    setDialogOpen(true)
  }

  const getSpotDetails = (spotId: string) => {
    return getSpotData(spotId)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading parking map...</p>
      </div>
    )
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
    <div className="overflow-auto">
      <div className="min-w-[800px] p-4 space-y-6">        {PARKING_ROWS.map((row) => (
          <div key={row} className="flex items-center gap-4">
            <div className="font-bold text-lg w-8">{row}</div>
            <div className="flex gap-2">
              {Array.from({ length: SPOTS_PER_ROW }).map((_, i) => {
                const spotNumber = (i + 1).toString().padStart(2, "0")
                const spotId = `${row}${spotNumber}`
                const isElectricRow = row === "A" || row === "F"
                const { status, spotData } = getSpotStatus(spotId)
                
                return (
                  <button
                    key={spotId}                    className={`w-16 h-16 rounded-md flex flex-col items-center justify-center text-xs font-medium border-2 ${
                      status === "checked-in"
                        ? "bg-blue-100 border-blue-400 text-blue-700"
                        : status === "reserved"
                        ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                        : status === "occupied-reserved" || status === "occupied"
                        ? "bg-red-100 border-red-400 text-red-700"
                        : isElectricRow && status === "available"
                        ? "bg-blue-100 border-blue-300 text-blue-700 hover:border-blue-400"
                        : "bg-green-100 border-green-300 text-green-700 hover:border-green-400"
                    } transition-colors`}
                    onClick={() => handleSpotClick(spotId)}
                  >
                    <span className="font-semibold">{spotId}</span>
                    {(spotData?.hascharger || isElectricRow) && <Zap className="h-3 w-3 text-yellow-500" />}
                  </button>
                )
              })}
            </div>          </div>
        ))}          <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded-sm"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded-sm"></div>
            <span className="text-sm">EV Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded-sm"></div>
            <span className="text-sm">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded-sm"></div>
            <span className="text-sm">Checked In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded-sm"></div>
            <span className="text-sm">Occupied</span>
          </div>
        </div>
      </div>

      {selectedSpot && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Parking Spot {selectedSpot}</DialogTitle>
              <DialogDescription>
                {(() => {
                  const spotData = getSpotDetails(selectedSpot)
                  const isElectricRow = selectedSpot.charAt(0) === "A" || selectedSpot.charAt(0) === "F"
                  return (spotData?.hascharger || isElectricRow) && (
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Electric charging available
                    </div>
                  )
                })()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select defaultValue={(() => {
                  const { status } = getSpotStatus(selectedSpot)
                  return status
                })()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(() => {
                const { status } = getSpotStatus(selectedSpot)
                return status === "reserved" && (
                  <div className="space-y-2">
                    <Label>Reserved By</Label>
                    <Input placeholder="User information not available" disabled />
                  </div>
                )
              })()}

              <div className="space-y-2">
                <Label>Spot Details</Label>
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    const spotData = getSpotDetails(selectedSpot)
                    return spotData ? (                      <div className="space-y-1">                        <p>Spot ID: {spotData.id}</p>
                        <p>Row: {spotData.row}</p>
                        <p>Number: {spotData.spotnumber}</p>
                        <p>Has Charger: {spotData.hascharger ? "Yes" : "No"}</p>
                        <p>Available: {spotData.isavailable ? "Yes" : "No"}</p>
                        <p>Reserved: {spotData.isreserved ? "Yes" : "No"}</p>
                        <p>Checked In: {spotData.isCheckin ? "Yes" : "No"}</p>
                      </div>
                    ) : (
                      <p>Spot data not available</p>
                    )
                  })()}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Select defaultValue="full-day">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-day">Full day (8:00 AM - 6:00 PM)</SelectItem>
                    <SelectItem value="morning">Morning (8:00 AM - 1:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (1:00 PM - 6:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
