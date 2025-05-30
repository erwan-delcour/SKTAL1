"use client"

import { useState, useActionState, useEffect, useRef, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Zap, RotateCcw, Crown } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { createParkingReservation, type ReservationFormState } from "@/actions/parking-reservations-action"
import type { DateRange } from "react-day-picker"

interface ManagerParkingReservationFormProps {
  onReservationCreated?: () => void
}

export function ManagerParkingReservationForm({ onReservationCreated }: ManagerParkingReservationFormProps) {
  const { success, error } = useToast()
  
  // Fonction pour formater la date sans problème de fuseau horaire
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // États du formulaire
  const today = new Date()
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({from: undefined, to: undefined})
  const [needsCharging, setNeedsCharging] = useState(false)
  
  // Calculer le nombre de jours automatiquement
  const numDays = selectedDateRange?.from && selectedDateRange?.to 
    ? (() => {
        // Normaliser les dates pour ignorer les heures
        const fromDate = new Date(selectedDateRange.from.getFullYear(), selectedDateRange.from.getMonth(), selectedDateRange.from.getDate())
        const toDate = new Date(selectedDateRange.to.getFullYear(), selectedDateRange.to.getMonth(), selectedDateRange.to.getDate())
        const diffTime = toDate.getTime() - fromDate.getTime()
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      })()
    : selectedDateRange?.from 
      ? 1 // Si seulement from est défini, c'est 1 jour
      : 0 // Si aucune date n'est sélectionnée
  
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
    const month = date.toLocaleString("en-US", { month: "short" })
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Limite de 30 jours pour les managers
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    maxDate.setHours(23, 59, 59, 999)
    
    return date < today || date > maxDate
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      // Si range est undefined, c'est une désélection complète
      setSelectedDateRange({from: undefined, to: undefined})
      return
    }
    
    // Gérer le cas de désélection d'une date spécifique
    if (selectedDateRange?.from && selectedDateRange?.to) {
      // Si nous avons déjà une plage complète et qu'on clique sur une des dates existantes
      if (range.from && !range.to) {
        const clickedDate = range.from.getTime()
        const fromTime = selectedDateRange.from.getTime()
        const toTime = selectedDateRange.to.getTime()
        
        // Si on clique sur la date de début, garder seulement la date de fin
        if (clickedDate === fromTime && fromTime !== toTime) {
          setSelectedDateRange({from: selectedDateRange.to, to: selectedDateRange.to})
          return
        }
        
        // Si on clique sur la date de fin, garder seulement la date de début
        if (clickedDate === toTime && fromTime !== toTime) {
          setSelectedDateRange({from: selectedDateRange.from, to: selectedDateRange.from})
          return
        }
        
        // Si on clique sur la même date (cas d'une réservation d'un jour), désélectionner
        if (clickedDate === fromTime && fromTime === toTime) {
          setSelectedDateRange({from: undefined, to: undefined})
          return
        }
      }
    }
    
    if (range.from && !range.to) {
      // Si seulement la date de début est sélectionnée, la considérer comme une réservation d'un jour
      setSelectedDateRange({from: range.from, to: range.from})
    } else if (range.from && range.to) {
      // Calculer le nombre de jours entre from et to en normalisant les dates
      const fromDate = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate())
      const toDate = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate())
      const diffTime = toDate.getTime() - fromDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      
      // Limiter à 30 jours maximum pour les managers
      if (diffDays <= 30) {
        setSelectedDateRange(range)
      } else {
        // Si plus de 30 jours, limiter à 30 jours à partir de from
        const newTo = new Date(range.from)
        newTo.setDate(newTo.getDate() + 29)
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

    const startDate = formatDateForAPI(selectedDateRange.from)
    const endDate = selectedDateRange.to 
      ? formatDateForAPI(selectedDateRange.to)
      : formatDateForAPI(selectedDateRange.from)

    // Debug: Afficher les données qui vont être envoyées
    console.log("Manager form submission data:", {
      startDate,
      endDate,
      numDays,
      needsCharging,
      selectedDateRange
    })

    const formData = new FormData(event.currentTarget)
    formData.append("startDate", startDate)
    formData.append("endDate", endDate)
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
        value={selectedDateRange?.from ? formatDateForAPI(selectedDateRange.from) : ''} 
      />
      <input 
        type="hidden" 
        name="endDate" 
        value={selectedDateRange?.to ? formatDateForAPI(selectedDateRange.to) : selectedDateRange?.from ? formatDateForAPI(selectedDateRange.from) : ''} 
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
      
      {/* Message pour les managers */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-center gap-2 text-blue-700">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-medium">Manager Privileges</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          As a manager, you can reserve parking spots for up to 30 days in advance.
        </p>
      </div>
      
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
        
        {!selectedDateRange?.from && (
          <p className="text-sm text-center text-muted-foreground">
            Please select a date for your reservation
          </p>
        )}
        {selectedDateRange?.from && selectedDateRange?.to && (
          <p className="text-sm text-center text-muted-foreground">
            {numDays} day{numDays > 1 ? 's' : ''} selected: {formatDateForDisplay(selectedDateRange.from)} - {formatDateForDisplay(selectedDateRange.to)}
          </p>
        )}
        {selectedDateRange?.from && !selectedDateRange?.to && (
          <p className="text-sm text-center text-muted-foreground">
            1 day selected: {formatDateForDisplay(selectedDateRange.from)} (or select an end date for multi-day reservation)
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
