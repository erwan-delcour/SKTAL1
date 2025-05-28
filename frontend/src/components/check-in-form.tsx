"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Keyboard } from "lucide-react"
import {useToast} from "@/hooks/useToast";

interface CheckInFormProps {
  reservations: Array<{
    id: number
    date: string
    spot: string
    time: string
    isElectric: boolean
  }>
  onCheckIn: (reservationId: number, spotId: string) => void
}

export function CheckInForm({ reservations, onCheckIn }: CheckInFormProps) {
  const { toast } = useToast()
  const [spotId, setSpotId] = useState("")
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkedInSpot, setCheckedInSpot] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckIn = () => {
    if (!spotId.match(/^[A-F][0-9]{2}$/)) {
      // toast({
      //   title: "Invalid spot ID",
      //   description: "Please enter a valid spot ID in the format: Row (A-F) + Number (01-10)",
      //   variant: "destructive",
      // })
      return
    }

    setIsSubmitting(true)

    // Find if there's a reservation for this spot
    const reservation = reservations.find((r) => r.spot === spotId)

    if (!reservation) {
      setIsSubmitting(false)
      // toast({
      //   title: "No reservation found",
      //   description: `You don't have a reservation for spot ${spotId}. Please check the spot ID and try again.`,
      //   variant: "destructive",
      // })
      return
    }

    // In a real app, this would make an API call to check in
    setTimeout(() => {
      // Call the callback to update parent component
      onCheckIn(reservation.id, spotId)

      // Update local state
      setCheckedInSpot(spotId)
      setIsCheckedIn(true)
      setIsSubmitting(false)

      // Show success toast
      // toast({
      //   title: "Check-in successful",
      //   description: `You have successfully checked in to spot ${spotId}.`,
      // })
    }, 1000)
  }

  if (isCheckedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-10 w-10 text-green-600"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-green-600">Check-in Successful!</h3>
        <p className="text-muted-foreground mt-2">You have successfully checked in to spot {checkedInSpot}.</p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            setIsCheckedIn(false)
            setSpotId("")
            setCheckedInSpot("")
          }}
        >
          Check in to another spot
        </Button>
      </div>
    )
  }

  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="scan" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Scan QR Code
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex items-center gap-2">
          <Keyboard className="h-4 w-4" />
          Enter Manually
        </TabsTrigger>
      </TabsList>
      <TabsContent value="scan" className="space-y-4 py-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
          <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Scan QR Code</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            Point your camera at the QR code displayed at your parking spot to check in.
          </p>
          <Button className="mt-4">Open Camera</Button>
        </div>
      </TabsContent>
      <TabsContent value="manual" className="space-y-4 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spot-id">Parking Spot ID</Label>
            <Input
              id="spot-id"
              placeholder="e.g. A01"
              value={spotId}
              onChange={(e) => setSpotId(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-muted-foreground">Enter the spot ID in the format: Row (A-F) + Number (01-10)</p>
          </div>
          <Button onClick={handleCheckIn} disabled={!spotId.match(/^[A-F][0-9]{2}$/) || isSubmitting}>
            {isSubmitting ? "Checking in..." : "Check In"}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
