"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardShell } from "@/components/dashboard-shell"
import { ReservationCalendar } from "@/components/reservation-calendar"
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

export default function EmployeeReservationsPage() {
  const { success, error } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)

  // Mock data for reservations
  const [reservations, setReservations] = useState([
    {
      id: 1,
      date: "May 27, 2025",
      spot: "A03",
      time: "Full day (8:00 AM - 6:00 PM)",
      isElectric: true,
      status: "upcoming",
    },
    {
      id: 2,
      date: "May 28, 2025",
      spot: "B07",
      time: "Morning (8:00 AM - 1:00 PM)",
      isElectric: false,
      status: "upcoming",
    },
    {
      id: 3,
      date: "May 29, 2025",
      spot: "C04",
      time: "Afternoon (1:00 PM - 6:00 PM)",
      isElectric: false,
      status: "upcoming",
    },
    {
      id: 4,
      date: "May 26, 2025",
      spot: "F02",
      time: "Full day (8:00 AM - 6:00 PM)",
      isElectric: true,
      status: "active",
    },
  ])
  const handleReservationCreated = (newReservation: {
    id: number
    date: string
    spot: string
    time: string
    isElectric: boolean
  }) => {
    setReservations([...reservations, { ...newReservation, status: "upcoming" }])
    success(`Your parking spot ${newReservation.spot} has been reserved for ${newReservation.date}.`)
  }

  const handleCancelReservation = (id: number) => {
    setReservations(reservations.filter((res) => res.id !== id))
    success("Your parking reservation has been successfully cancelled.")
  }

  // Filter reservations based on search query, status, and date
  const filteredReservations = reservations.filter((reservation) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      reservation.spot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.date.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    // Filter by date
    const matchesDate = !dateFilter || reservation.date === format(dateFilter, "MMM d, yyyy")

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
                <DialogDescription>Select a date and preferences for your parking reservation.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ReservationCalendar
                  onReservationCreated={(res) => {
                    handleReservationCreated(res)
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
            {filteredReservations.length === 0 ? (
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
                            Select a date and preferences for your parking reservation.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <ReservationCalendar
                            onReservationCreated={(res) => {
                              handleReservationCreated(res)
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
                {filteredReservations.map((reservation) => (
                  <Card key={reservation.id} className={cn(reservation.status === "active" && "border-primary")}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">Spot {reservation.spot}</h3>
                            {reservation.isElectric && <Zap className="h-4 w-4 text-yellow-500" />}
                            <Badge variant={reservation.status === "active" ? "default" : "secondary"}>
                              {reservation.status === "active" ? "Active Today" : "Upcoming"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{reservation.date}</p>
                          <p className="text-muted-foreground">{reservation.time}</p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {reservation.status === "active" && (
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
                ))}
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
                        const dateString = format(props.date, "MMM d, yyyy")
                        const hasReservation = reservations.some((r) => r.date === dateString)

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
                      {reservations.filter((r) => r.date === format(date, "MMM d, yyyy")).length > 0 ? (
                        <div className="space-y-2">
                          {reservations
                            .filter((r) => r.date === format(date, "MMM d, yyyy"))
                            .map((reservation) => (
                              <div
                                key={reservation.id}
                                className="flex justify-between items-center p-3 border rounded-md"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Spot {reservation.spot}</span>
                                    {reservation.isElectric && <Zap className="h-4 w-4 text-yellow-500" />}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{reservation.time}</p>
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
                            ))}
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
