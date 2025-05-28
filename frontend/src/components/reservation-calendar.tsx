"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Zap } from "lucide-react"
import {useToast} from "@/hooks/useToast";

interface ReservationCalendarProps {
  onReservationCreated?: (reservation: {
    id: number
    date: string
    spot: string
    time: string
    isElectric: boolean
  }) => void
}

export function ReservationCalendar({ onReservationCreated }: ReservationCalendarProps) {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [needsCharging, setNeedsCharging] = useState(false)
  const [parkingArea, setParkingArea] = useState("any")
  const [timeSlot, setTimeSlot] = useState("full-day")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    const month = date.toLocaleString("default", { month: "short" })
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  const handleSubmit = () => {
    if (!date) {
      // toast({
      //   title: "Error",
      //   description: "Please select a date for your reservation.",
      //   variant: "destructive",
      // })
      return
    }

    setIsSubmitting(true)

    // In a real app, this would make an API call to create the reservation
    setTimeout(() => {
      // Generate a spot ID based on preferences
      let spotLetter = "C" // Default to middle section

      if (needsCharging) {
        // If needs charging, must be in rows A or F
        spotLetter = Math.random() > 0.5 ? "A" : "F"
      } else if (parkingArea === "entrance") {
        spotLetter = Math.random() > 0.5 ? "A" : "F"
      } else if (parkingArea === "middle") {
        spotLetter = Math.random() > 0.5 ? "B" : "E"
      } else if (parkingArea === "back") {
        spotLetter = Math.random() > 0.5 ? "C" : "D"
      }

      // Random number between 1-10, formatted as 01, 02, etc.
      const spotNumber = (Math.floor(Math.random() * 10) + 1).toString().padStart(2, "0")
      const spotId = `${spotLetter}${spotNumber}`

      // Map time slot to display text
      const timeSlotText = timeSlot === "full-day" ? "Full day" : timeSlot === "morning" ? "Morning" : "Afternoon"

      // Create the new reservation
      const newReservation = {
        id: Date.now(), // Use timestamp as ID
        date: formatDate(date),
        spot: spotId,
        time: timeSlotText,
        isElectric: needsCharging || spotLetter === "A" || spotLetter === "F",
      }

      // Call the callback to update parent component
      if (onReservationCreated) {
        onReservationCreated(newReservation)
      }

      // Show success toast
      // toast({
      //   title: "Reservation created",
      //   description: `Your parking spot ${spotId} has been reserved for ${formatDate(date)}.`,
      // })

      // Reset form
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        disabled={(date) => {
          // Disable past dates and dates more than 5 days in the future
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const maxDate = new Date()
          maxDate.setDate(maxDate.getDate() + 5)
          maxDate.setHours(23, 59, 59, 999)

          return date < today || date > maxDate
        }}
      />

      <div className="space-y-4 px-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="needs-charging"
            checked={needsCharging}
            onCheckedChange={(checked) => setNeedsCharging(checked === true)}
          />
          <Label htmlFor="needs-charging" className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-yellow-500" />I need an electric charging spot
          </Label>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Preferred parking area</Label>
          <RadioGroup value={parkingArea} onValueChange={setParkingArea}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="any" />
              <Label htmlFor="any">Any available spot</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="entrance" id="entrance" />
              <Label htmlFor="entrance">Near entrance (A01-A10, F01-F10)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="middle" id="middle" />
              <Label htmlFor="middle">Middle section (B01-B10, E01-E10)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="back" id="back" />
              <Label htmlFor="back">Back section (C01-C10, D01-D10)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time-slot">Time slot</Label>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger id="time-slot">
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-day">Full day (8:00 AM - 6:00 PM)</SelectItem>
              <SelectItem value="morning">Morning (8:00 AM - 1:00 PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (1:00 PM - 6:00 PM)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting || !date}>
          {isSubmitting ? "Creating reservation..." : "Reserve Spot"}
        </Button>
      </div>
    </div>
  )
}
