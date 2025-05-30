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
    id: string // Changé de number à string
    date: string
    spot: string
    time: string
    isElectric: boolean
  }>
  onCheckIn: (reservationId: string, spotId: string) => void // Changé de number à string
}

export function CheckInForm({ reservations, onCheckIn }: CheckInFormProps) {
  const { toast, success, error } = useToast()
  const [spotId, setSpotId] = useState("")
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkedInSpot, setCheckedInSpot] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckIn = () => {
    if (!spotId.match(/^[A-F][0-9]{2}$/)) {
      error("Veuillez entrer un identifiant de place valide au format : Rangée (A-F) + Numéro (01-10)")
      return
    }

    setIsSubmitting(true)

    // Find if there's a reservation for this spot
    const reservation = reservations.find((r) => r.spot === spotId)

    if (!reservation) {
      setIsSubmitting(false)
      error(`Vous n'avez pas de réservation pour la place ${spotId}. Veuillez vérifier l'identifiant et réessayer.`)
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
      success(`Vous avez bien effectué le check-in à la place ${spotId}.`)
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
  )
}
