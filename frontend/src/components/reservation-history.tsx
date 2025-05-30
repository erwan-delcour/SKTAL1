"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Zap, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { 
  getUserReservationHistoryClient,
  type UserReservationsState 
} from "@/actions/user-reservations-action"
import {
  getHistoryReservationStatus,
  formatHistoryDate,
  getHistorySpotName
} from "@/lib/reservation-utils"

// Types for history reservations
interface Reservation {
  id: string
  userId: string
  startDate: string
  endDate: string
  needsCharger: boolean
  statusChecked: boolean
  checkInTime?: string
  spot: {
    id: string
    row: string
    spotNumber: number
    hasCharger: boolean
    isAvailable: boolean
  }
}

interface ReservationHistoryProps {
  onHistoryLoad?: (count: number) => void
}

export function ReservationHistory({ onHistoryLoad }: ReservationHistoryProps) {
  const [history, setHistory] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  // Load reservation history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const result = await getUserReservationHistoryClient()
        
        if (result.success) {
          setHistory(result.reservations)
          onHistoryLoad?.(result.reservations.length)
        } else {
          setError(result.error || "Failed to load reservation history")
        }
      } catch (err) {
        console.error("Failed to load reservation history:", err)
        setError(err instanceof Error ? err.message : "Failed to load reservation history")
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [onHistoryLoad])

  // Filtrer l'historique
  const filteredHistory = history.filter((reservation) => {
    const spot = getHistorySpotName(reservation)
    const date = formatHistoryDate(reservation.startDate, reservation.endDate)
    const status = getHistoryReservationStatus(reservation)
    
    const matchesSearch = searchQuery === "" || 
      spot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      date.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  // Trier par date (plus récent en premier)
  const sortedHistory = filteredHistory.sort((a, b) => {
    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  })
      if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading reservation history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-10 w-10 text-destructive mb-2" />
          <h3 className="text-lg font-medium text-destructive">Error Loading History</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4"><div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by spot or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="no show">No Show</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>      {/* Reservation history */}
      {sortedHistory.length === 0 ? (<div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">
            {history.length === 0 ? "No reservation history" : "No matching reservations"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {history.length === 0 
              ? "Your past reservations will appear here." 
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedHistory.map((reservation) => {
            const status = getHistoryReservationStatus(reservation)
            const spot = getHistorySpotName(reservation)
            const date = formatHistoryDate(reservation.startDate, reservation.endDate)
            
            return (
              <Card key={reservation.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{date}</span>                      {reservation.needsCharger && (
                        <Zap className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>Place {spot}</span>
                      {reservation.checkInTime && (
                        <>
                          <Clock className="h-3 w-3 ml-2" />                          <span>
                            Checked in at {new Date(reservation.checkInTime).toLocaleTimeString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <Badge
                      variant={
                        status === "Completed" 
                          ? "default" 
                          : status === "Cancelled" 
                            ? "secondary" 
                            : "destructive"
                      }
                      className={
                        status === "Completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : status === "Cancelled"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                      }
                    >                      {status === "Completed" ? "Completed" : 
                       status === "Cancelled" ? "Cancelled" : "No Show"}
                    </Badge>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}      {/* Summary */}
      {history.length > 0 && (<div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{history.length}</span> total reservations in history
            {filteredHistory.length !== history.length && (
              <span> • <span className="font-medium">{filteredHistory.length}</span> matching filters</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
