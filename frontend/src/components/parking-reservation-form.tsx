"use client"

import { useState, useActionState, useEffect, useRef, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Zap, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { createParkingReservation, type ReservationFormState } from "@/actions/parking-reservations-action"
import type { DateRange } from "react-day-picker"

interface ParkingReservationFormProps {
  onReservationCreated?: () => void
}

export function ParkingReservationForm({ onReservationCreated }: ParkingReservationFormProps) {
  const { success, error } = useToast()
  
  // États du formulaire
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({from: new Date(), to: undefined})
  const [needsCharging, setNeedsCharging] = useState(false)
  
  // Calculer le nombre de jours automatiquement
  const numDays = selectedDateRange?.from && selectedDateRange?.to 
    ? Math.ceil(Math.abs(selectedDateRange.to.getTime() - selectedDateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1
  
  // Action state pour la soumission
  const [actionState, submitAction, isSubmitting] = useActionState(createParkingReservation, {
    message: "",
    success: false,
  } as ReservationFormState)
  
  // Référence pour éviter les toasts multiples
  const previousActionStateRef = useRef<typeof actionState | null>(null)

  // Gestion des réponses de l'action
  useEffect(() => {
    const hasStateChanged = actionState.message && 
        previousActionStateRef.current && 
        (previousActionStateRef.current.message !== actionState.message || 
         previousActionStateRef.current.success !== actionState.success)

    if (hasStateChanged) {
      if (actionState.success) {
        success(actionState.message)
        onReservationCreated?.()
        resetForm()
      } else if (!actionState.success) {
        error(actionState.message)
      }
    }
    
    previousActionStateRef.current = actionState
  }, [actionState, success, error, onReservationCreated])

  const resetForm = () => {
    setSelectedDateRange({from: new Date(), to: undefined})
    setNeedsCharging(false)
  }

  const resetCalendarSelection = () => {
    setSelectedDateRange({from: undefined, to: undefined})
  }

  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return ""
    const month = date.toLocaleString("default", { month: "short" })
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 5)
    maxDate.setHours(23, 59, 59, 999)
    
    return date < today || date > maxDate
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) return
    
    if (range.from && range.to) {
      // Calculer le nombre de jours entre from et to
      const diffTime = Math.abs(range.to.getTime() - range.from.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      
      // Limiter à 5 jours maximum
      if (diffDays <= 5) {
        setSelectedDateRange(range)
      } else {
        // Si plus de 5 jours, limiter à 5 jours à partir de from
        const newTo = new Date(range.from)
        newTo.setDate(newTo.getDate() + 4)
        setSelectedDateRange({from: range.from, to: newTo})
      }
    } else {
      setSelectedDateRange(range)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!selectedDateRange?.from) {
      error("Please select a date for your reservation.")
      return
    }

    const formData = new FormData(event.currentTarget)
    formData.append("startDate", selectedDateRange.from.toISOString().split('T')[0])
    
    if (selectedDateRange.to) {
      formData.append("endDate", selectedDateRange.to.toISOString().split('T')[0])
    } else {
      formData.append("endDate", selectedDateRange.from.toISOString().split('T')[0])
    }
    
    formData.append("numDays", numDays.toString())
    formData.append("needsCharging", needsCharging.toString())

    startTransition(() => {
      submitAction(formData)
    })
  }

  return (
    <form action={submitAction} onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden inputs for form data */}
      <input 
        type="hidden" 
        name="startDate" 
        value={selectedDateRange?.from ? selectedDateRange.from.toISOString().split('T')[0] : ''} 
      />
      <input 
        type="hidden" 
        name="endDate" 
        value={selectedDateRange?.to ? selectedDateRange.to.toISOString().split('T')[0] : selectedDateRange?.from ? selectedDateRange.from.toISOString().split('T')[0] : ''} 
      />
      <input 
        type="hidden" 
        name="numDays" 
        value={numDays.toString()} 
      />
      <input 
        type="hidden" 
        name="needsCharging" 
        value={needsCharging.toString()} 
      />
      
      {/* Sélection de date */}
      <div className="space-y-2">
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={selectedDateRange}
            onSelect={handleDateRangeSelect}
            className="rounded-md border"
            disabled={isDateDisabled}
            numberOfMonths={1}
          />
        </div>
        
        {/* Bouton de réinitialisation */}
        {selectedDateRange?.from && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetCalendarSelection}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Calendar
            </Button>
          </div>
        )}
        
        {selectedDateRange?.from && selectedDateRange?.to && (
          <p className="text-sm text-center text-muted-foreground">
            {numDays} day{numDays > 1 ? 's' : ''} selected: {formatDateForDisplay(selectedDateRange.from)} - {formatDateForDisplay(selectedDateRange.to)}
          </p>
        )}
        {selectedDateRange?.from && !selectedDateRange?.to && (
          <p className="text-sm text-center text-muted-foreground">
            Select an end date (max 5 days from start date)
          </p>
        )}
      </div>

      <Separator />

      {/* Options de réservation */}
      <div className="space-y-4">
        {/* Besoin de recharge */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="needs-charging"
            checked={needsCharging}
            onCheckedChange={(checked) => setNeedsCharging(checked === true)}
          />
          <Label htmlFor="needs-charging" className="flex items-center gap-2 cursor-pointer">
            <Zap className="h-4 w-4 text-yellow-500" />
            I need an electric charging spot
          </Label>
        </div>
      </div>

      {/* Bouton de soumission */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !selectedDateRange?.from}
        size="lg"
      >
        {isSubmitting 
          ? `Creating ${numDays} reservation${numDays > 1 ? 's' : ''}...` 
          : `Reserve Parking Spot${numDays > 1 ? 's' : ''} (${numDays} day${numDays > 1 ? 's' : ''})`
        }
      </Button>
    </form>
  )
}
