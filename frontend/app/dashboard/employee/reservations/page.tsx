"use client"

import { useState, useEffect } from "react"
import { getUserReservationsClient, type UserReservationsState } from "@/actions/user-reservations-action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardShell } from "@/components/dashboard-shell"
import { ParkingReservationForm } from "@/components/parking-reservation-form"
import { useToast } from "@/hooks/useToast"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Car, Filter, List, Plus, Search, Zap } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Types pour les réservations
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

// Fonctions utilitaires pour adapter les données API
function formatReservationDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = start.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  if (startDate === endDate) {
    return startFormatted;
  } else {
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${startFormatted} - ${endFormatted}`;
  }
}

function getReservationSpot(reservation: Reservation): string {
  if (reservation.spot) {
    return `${reservation.spot.row}${reservation.spot.spotNumber}`;
  }
  return "Pending assignment";
}

function getReservationTime(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (daysDiff === 1) {
    return "Full day";
  } else {
    return `${daysDiff} days`;
  }
}

function getReservationStatus(reservation: Reservation): string {
  const today = new Date();
  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  if (today >= startDate && today <= endDate) {
    return reservation.statusChecked ? 'checked-in' : 'active';
  } else if (today < startDate) {
    return 'upcoming';
  } else {
    return 'completed';
  }
}

// Function to check if a date has a reservation
function hasReservationOnDate(reservations: Reservation[], targetDate: Date): boolean {
  return reservations.some(reservation => {
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    return targetDate >= startDate && targetDate <= endDate;
  });
}

// Function to get reservations for a specific date
function getReservationsForDate(reservations: Reservation[], targetDate: Date): Reservation[] {
  return reservations.filter(reservation => {
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    return targetDate >= startDate && targetDate <= endDate;
  });
}

export default function EmployeeReservationsPage() {
  const { success, error } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Charger les réservations au montage du composant
  useEffect(() => {
    const loadReservations = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        
        const result = await getUserReservationsClient()
        
        if (result.success) {
          setReservations(result.reservations)
        } else {
          setLoadError(result.error || "Failed to load reservations")
        }
      } catch (err) {
        console.error("Failed to load reservations:", err)
        setLoadError(err instanceof Error ? err.message : "Failed to load reservations")
      } finally {
        setIsLoading(false)
      }
    }

    loadReservations()
  }, [])
  
  const handleReservationCreated = async () => {
    // Rafraîchir les réservations après création d'une nouvelle demande
    try {
      const result = await getUserReservationsClient()
      if (result.success) {
        setReservations(result.reservations)
      }
    } catch (err) {
      console.error("Failed to refresh reservations:", err)
    }
  }

  const handleCancelReservation = (id: string) => {
    setReservations(reservations.filter((res) => res.id !== id))
    success("Your parking reservation has been successfully cancelled.")
  }

  // Filter reservations based on search query, status, and date
  const filteredReservations = reservations.filter((reservation) => {
    // Filter by search query
    const spot = getReservationSpot(reservation);
    const dateText = formatReservationDate(reservation.startDate, reservation.endDate);
    const matchesSearch =
      searchQuery === "" ||
      spot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dateText.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const currentStatus = getReservationStatus(reservation);
    const matchesStatus = statusFilter === "all" || currentStatus === statusFilter

    // Filter by date (check if the selected date falls within the reservation range)
    const matchesDate = !dateFilter || (() => {
      const filterDate = format(dateFilter, "MMM d, yyyy");
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      const selectedDate = new Date(dateFilter);
      
      return selectedDate >= startDate && selectedDate <= endDate;
    })();

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <DashboardShell title="My Reservations" description="View and manage your parking reservations" userRole="Employee">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reservations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Status</h4>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All reservations</SelectItem>
                        <SelectItem value="active">Active today</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Date</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFilter && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStatusFilter("all")
                        setDateFilter(undefined)
                      }}
                    >
                      Reset
                    </Button>
                    <Button size="sm" onClick={() => setIsFiltersOpen(false)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Reservation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Reservation</DialogTitle>
                <DialogDescription>Select date range and options for your parking reservation request.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ParkingReservationForm
                  onReservationCreated={() => {
                    handleReservationCreated()
                    // Close the dialog by clicking the close button
                    document
                      .querySelector("[data-dialog-close]")
                      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Loading your reservations...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : loadError ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-destructive mb-2">{loadError}</p>
                    <div className="flex gap-2 justify-center">
                      {loadError.includes("Authentication") || loadError.includes("login") ? (
                        <Button 
                          onClick={() => window.location.href = '/login'} 
                          className="gap-2"
                        >
                          Go to Login
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => window.location.reload()} 
                          variant="outline"
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : filteredReservations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Car className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No reservations found</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    {searchQuery || statusFilter !== "all" || dateFilter
                      ? "Try adjusting your filters or search query."
                      : "You don't have any reservations yet. Create a new reservation to get started."}
                  </p>
                  {!searchQuery && statusFilter === "all" && !dateFilter && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4 gap-2">
                          <Plus className="h-4 w-4" />
                          New Reservation
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Create New Reservation</DialogTitle>
                          <DialogDescription>
                            Select date range and options for your parking reservation request.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <ParkingReservationForm
                            onReservationCreated={() => {
                              handleReservationCreated()
                              // Close the dialog by clicking the close button
                              document
                                .querySelector("[data-dialog-close]")
                                ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredReservations.map((reservation) => {
                  const currentStatus = getReservationStatus(reservation);
                  const spot = getReservationSpot(reservation);
                  const dateText = formatReservationDate(reservation.startDate, reservation.endDate);
                  const timeText = getReservationTime(reservation.startDate, reservation.endDate);
                  const hasCharger = reservation.needsCharger || reservation.spot?.hasCharger;
                  
                  return (
                  <Card key={reservation.id} className={cn(currentStatus === "active" && "border-primary")}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">Spot {spot}</h3>
                            {hasCharger && <Zap className="h-4 w-4 text-yellow-500" />}
                            <Badge variant={currentStatus === "active" ? "default" : "secondary"}>
                              {currentStatus === "active" ? "Active Today" : currentStatus === "upcoming" ? "Upcoming" : "Completed"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{dateText}</p>
                          <p className="text-muted-foreground">{timeText}</p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {currentStatus === "active" && (
                            <Button variant="outline" className="gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              Check In
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" className="gap-2">
                                Cancel
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Reservation</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel this parking reservation? This action cannot be
                                  undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    // Close the dialog by clicking the close button
                                    document
                                      .querySelector("[data-dialog-close]")
                                      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                                  }}
                                >
                                  Keep Reservation
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    handleCancelReservation(reservation.id)
                                    // Close the dialog by clicking the close button
                                    document
                                      .querySelector("[data-dialog-close]")
                                      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                                  }}
                                >
                                  Yes, Cancel Reservation
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Calendar</CardTitle>
                <CardDescription>View your reservations in a calendar format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md mx-auto"
                    classNames={{
                      day_today: "bg-primary/10 text-primary font-bold",
                      day_selected: "bg-primary text-primary-foreground",
                    }}
                    components={{
                      DayContent: (props) => {
                        // Check if there's a reservation on this day
                        const hasReservation = hasReservationOnDate(reservations, props.date);

                        return (
                          <div className="relative h-full w-full p-2 flex items-center justify-center">
                            <div>{props.date.getDate()}</div>
                            {hasReservation && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
                            )}
                          </div>
                        )
                      },
                    }}
                  />

                  {date && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Reservations for {format(date, "MMMM d, yyyy")}</h3>
                      {getReservationsForDate(reservations, date).length > 0 ? (
                        <div className="space-y-2">
                          {getReservationsForDate(reservations, date)
                            .map((reservation) => {
                              const spot = getReservationSpot(reservation);
                              const timeText = getReservationTime(reservation.startDate, reservation.endDate);
                              const hasCharger = reservation.needsCharger || reservation.spot?.hasCharger;
                              
                              return (
                              <div
                                key={reservation.id}
                                className="flex justify-between items-center p-3 border rounded-md"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Spot {spot}</span>
                                    {hasCharger && <Zap className="h-4 w-4 text-yellow-500" />}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{timeText}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleCancelReservation(reservation.id)}
                                >
                                  Cancel
                                </Button>
                              </div>
                              )
                            })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">No reservations for this date</div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
