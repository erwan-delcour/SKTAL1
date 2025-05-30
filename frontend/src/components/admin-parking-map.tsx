"use client"

import { useState } from "react"
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
import { Zap } from "lucide-react"

export function AdminParkingMap() {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Mock data for parking spots status
  const parkingStatus = {
    A: Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `A${(i + 1).toString().padStart(2, "0")}`,
        status: Math.random() > 0.5 ? "reserved" : "available",
        isElectric: true,
        user: Math.random() > 0.5 ? "John Doe" : null,
      })),
    B: Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `B${(i + 1).toString().padStart(2, "0")}`,
        status: Math.random() > 0.5 ? "reserved" : "available",
        isElectric: false,
        user: Math.random() > 0.5 ? "Alice Smith" : null,
      })),
    C: Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `C${(i + 1).toString().padStart(2, "0")}`,
        status: Math.random() > 0.5 ? "reserved" : "available",
        isElectric: false,
        user: Math.random() > 0.5 ? "Bob Johnson" : null,
      })),
    D: Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `D${(i + 1).toString().padStart(2, "0")}`,
        status: Math.random() > 0.5 ? "reserved" : "available",
        isElectric: false,
        user: Math.random() > 0.5 ? "Emma Wilson" : null,
      })),
    E: Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `E${(i + 1).toString().padStart(2, "0")}`,
        status: Math.random() > 0.5 ? "reserved" : "available",
        isElectric: false,
        user: Math.random() > 0.5 ? "Michael Brown" : null,
      })),
    F: Array(10)
      .fill(null)
      .map((_, i) => ({
        id: `F${(i + 1).toString().padStart(2, "0")}`,
        status: Math.random() > 0.5 ? "reserved" : "available",
        isElectric: true,
        user: Math.random() > 0.5 ? "Sarah Davis" : null,
      })),
  }

  const handleSpotClick = (spotId: string) => {
    setSelectedSpot(spotId)
    setDialogOpen(true)
  }

  const getSpotDetails = (spotId: string) => {
    type Row = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    const row = spotId.charAt(0) as Row;
    const number = Number.parseInt(spotId.substring(1)) - 1;
    return parkingStatus[row][number];
  }

  return (
    <div className="overflow-auto">
      <div className="min-w-[800px] p-4 space-y-6">
        {Object.entries(parkingStatus).map(([row, spots]) => (
          <div key={row} className="flex items-center gap-4">
            <div className="font-bold text-lg w-8">{row}</div>
            <div className="flex gap-2">
              {spots.map((spot) => (
                <button
                  key={spot.id}
                  className={`w-16 h-16 rounded-md flex flex-col items-center justify-center text-xs font-medium border-2 ${
                    spot.status === "reserved"
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted border-muted-foreground/20 hover:border-muted-foreground/40"
                  } transition-colors`}
                  onClick={() => handleSpotClick(spot.id)}
                >
                  {spot.id}
                  {spot.isElectric && <Zap className="h-3 w-3 text-yellow-500 mt-1" />}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/10 border-2 border-primary rounded-sm"></div>
            <span className="text-sm">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted border-2 border-muted-foreground/20 rounded-sm"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Electric Charging</span>
          </div>
        </div>
      </div>

      {selectedSpot && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Parking Spot {selectedSpot}</DialogTitle>
              <DialogDescription>
                {getSpotDetails(selectedSpot).isElectric && (
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Electric charging available
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select defaultValue={getSpotDetails(selectedSpot).status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {getSpotDetails(selectedSpot).status === "reserved" && (
                <div className="space-y-2">
                  <Label>Reserved By</Label>
                  <Input defaultValue={getSpotDetails(selectedSpot).user || ""} />
                </div>
              )}

              <div className="space-y-2">
                <Label>Reservation Date</Label>
                <Input type="date" defaultValue="2025-05-27" />
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
