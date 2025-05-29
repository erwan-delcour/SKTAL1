"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Edit, Trash, Zap } from "lucide-react"

export function ReservationManagement() {
  // Mock data for reservations
  const [reservations, setReservations] = useState([
    {
      id: 1,
      user: "John Doe",
      email: "john.doe@company.com",
      spot: "A03",
      date: "May 27, 2025",
      time: "Full day",
      status: "Confirmed",
      isElectric: true,
      checkedIn: true,
    },
    {
      id: 2,
      user: "Alice Smith",
      email: "alice.smith@company.com",
      spot: "B07",
      date: "May 27, 2025",
      time: "Morning",
      status: "Confirmed",
      isElectric: false,
      checkedIn: false,
    },
    {
      id: 3,
      user: "Bob Johnson",
      email: "bob.johnson@company.com",
      spot: "C04",
      date: "May 28, 2025",
      time: "Full day",
      status: "Confirmed",
      isElectric: false,
      checkedIn: false,
    },
    {
      id: 4,
      user: "Emma Wilson",
      email: "emma.wilson@company.com",
      spot: "F02",
      date: "May 28, 2025",
      time: "Afternoon",
      status: "Confirmed",
      isElectric: true,
      checkedIn: false,
    },
    {
      id: 5,
      user: "Mike Green",
      email: "mike.green@company.com",
      spot: "D09",
      date: "May 29, 2025",
      time: "Full day",
      status: "Confirmed",
      isElectric: false,
      checkedIn: false,
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Input placeholder="Search reservations..." className="w-[300px]" />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reservations</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          New Reservation
        </Button>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-4">
          <div className="border rounded-md">
            <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
              <div>User</div>
              <div>Spot</div>
              <div>Date</div>
              <div>Time</div>
              <div>Status</div>
              <div>Check-in</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {reservations
                .filter((r) => r.date === "May 27, 2025")
                .map((reservation) => (
                  <div key={reservation.id} className="grid grid-cols-7 gap-4 p-4 items-center">
                    <div>
                      <div>{reservation.user}</div>
                      <div className="text-xs text-muted-foreground">{reservation.email}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {reservation.spot}
                      {reservation.isElectric && <Zap className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div>{reservation.date}</div>
                    <div>{reservation.time}</div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {reservation.status}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          reservation.checkedIn ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {reservation.checkedIn ? "Checked In" : "Pending"}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tomorrow" className="space-y-4">
          <div className="border rounded-md">
            <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
              <div>User</div>
              <div>Spot</div>
              <div>Date</div>
              <div>Time</div>
              <div>Status</div>
              <div>Check-in</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {reservations
                .filter((r) => r.date === "May 28, 2025")
                .map((reservation) => (
                  <div key={reservation.id} className="grid grid-cols-7 gap-4 p-4 items-center">
                    <div>
                      <div>{reservation.user}</div>
                      <div className="text-xs text-muted-foreground">{reservation.email}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {reservation.spot}
                      {reservation.isElectric && <Zap className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div>{reservation.date}</div>
                    <div>{reservation.time}</div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {reservation.status}
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="upcoming">
          <div className="border rounded-md">
            <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
              <div>User</div>
              <div>Spot</div>
              <div>Date</div>
              <div>Time</div>
              <div>Status</div>
              <div>Check-in</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {reservations
                .filter((r) => r.date === "May 29, 2025")
                .map((reservation) => (
                  <div key={reservation.id} className="grid grid-cols-7 gap-4 p-4 items-center">
                    <div>
                      <div>{reservation.user}</div>
                      <div className="text-xs text-muted-foreground">{reservation.email}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {reservation.spot}
                      {reservation.isElectric && <Zap className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div>{reservation.date}</div>
                    <div>{reservation.time}</div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {reservation.status}
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No past reservations to display</h3>
            <p className="text-sm text-muted-foreground">Past reservations will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
