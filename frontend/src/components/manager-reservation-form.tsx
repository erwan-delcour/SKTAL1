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

export function ManagerReservationForm() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date
  })
  const [needsCharging, setNeedsCharging] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label>Start Date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => {
              // Disable past dates
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
          />
        </div>
        <div className="space-y-4">
          <Label>End Date</Label>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            className="rounded-md border"
            disabled={(date) => {
              // Disable past dates and dates more than 30 days in the future
              const today = new Date()
              today.setHours(0, 0, 0, 0)

              const maxDate = new Date()
              maxDate.setDate(maxDate.getDate() + 30)
              maxDate.setHours(23, 59, 59, 999)

              // Also disable dates before the start date
              return date < today || date > maxDate || date < date
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
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
          <RadioGroup defaultValue="any">
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
          <Select defaultValue="full-day">
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

        <Button className="w-full">Reserve Spot</Button>
      </div>
    </div>
  )
}
