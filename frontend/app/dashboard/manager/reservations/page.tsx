"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {DashboardShell} from "@/components/dashboard-shell"
import {Badge} from "@/components/ui/badge"
import {CalendarIcon, Car, Filter, List, Map, Search, Zap} from "lucide-react"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"
import {ParkingMapOverview} from "@/components/parking-map-overview"
import {Toaster} from "@/components/ui/sonner";

// Types
interface Reservation {
    id: number;
    userId: string;
    userName: string;
    userDepartment: string;
    date: string;
    spot: string;
    time: string;
    isElectric: boolean;
    status: "upcoming" | "active" | "completed" | "cancelled";
    checkedIn: boolean;
}

interface User {
    id: string;
    name: string;
    email: string;
    department: string;
}

const mockUsers: User[] = [
    {id: "user1", name: "John Doe", email: "john.doe@company.com", department: "Engineering"},
    {id: "user2", name: "Alice Smith", email: "alice.smith@company.com", department: "Administration"},
    {id: "user3", name: "Bob Johnson", email: "bob.johnson@company.com", department: "Marketing"},
    {id: "user4", name: "Emma Wilson", email: "emma.wilson@company.com", department: "Finance"},
    {id: "user5", name: "Mike Green", email: "mike.green@company.com", department: "Executive"},
]

export default function ManagerReservationsPage() {
    const [selectedDateForCalendarView, setSelectedDateForCalendarView] = useState<Date | undefined>(new Date())
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
    const [userFilter, setUserFilter] = useState("all")
    const [departmentFilter, setDepartmentFilter] = useState("all")
    const [isElectricFilter, setIsElectricFilter] = useState(false)

    // Mock data for reservations - assuming this comes from a service or context
    const [reservations, setReservations] = useState<Reservation[]>([
        {
            id: 1,
            userId: "user1",
            userName: "John Doe",
            userDepartment: "Engineering",
            date: "May 27, 2025",
            spot: "A03",
            time: "Full day (8:00 AM - 6:00 PM)",
            isElectric: true,
            status: "upcoming",
            checkedIn: false,
        },
        {
            id: 2,
            userId: "user2",
            userName: "Alice Smith",
            userDepartment: "Administration",
            date: "May 28, 2025",
            spot: "B07",
            time: "Morning (8:00 AM - 1:00 PM)",
            isElectric: false,
            status: "upcoming",
            checkedIn: false,
        },
        {
            id: 3,
            userId: "user3",
            userName: "Bob Johnson",
            userDepartment: "Marketing",
            date: "May 29, 2025",
            spot: "C04",
            time: "Afternoon (1:00 PM - 6:00 PM)",
            isElectric: false,
            status: "upcoming",
            checkedIn: false,
        },
        {
            id: 4,
            userId: "user4",
            userName: "Emma Wilson",
            userDepartment: "Finance",
            date: "May 26, 2025",
            spot: "F02",
            time: "Full day (8:00 AM - 6:00 PM)",
            isElectric: true,
            status: "active",
            checkedIn: true,
        },
        {
            id: 5,
            userId: "user5",
            userName: "Mike Green",
            userDepartment: "Executive",
            date: "May 26, 2025",
            spot: "D09",
            time: "Full day (8:00 AM - 6:00 PM)",
            isElectric: false,
            status: "active",
            checkedIn: false,
        },
    ])

    // Filter reservations
    const filteredReservations = reservations.filter((reservation) => {
        const matchesSearch =
            searchQuery === "" ||
            reservation.spot.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reservation.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reservation.date.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
        const matchesDate = !dateFilter || reservation.date === format(dateFilter, "MMM d, yyyy")
        const matchesUser = userFilter === "all" || reservation.userId === userFilter
        const matchesDepartment = departmentFilter === "all" || reservation.userDepartment === departmentFilter
        const matchesElectric = !isElectricFilter || reservation.isElectric === isElectricFilter

        return matchesSearch && matchesStatus && matchesDate && matchesUser && matchesDepartment && matchesElectric
    })
    return (
        <DashboardShell
            title="View All Reservations"
            description="Monitor parking reservations across the organization"
            userRole="Manager"
        >
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex flex-1 items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search by spot, user, date..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Filter className="h-4 w-4"/>
                                    Filters
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Status</h4>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All reservations</SelectItem>
                                                <SelectItem value="active">Active today</SelectItem>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="completed">Checked In</SelectItem>
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
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter}
                                                          initialFocus/>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">User</h4>
                                        <Select value={userFilter} onValueChange={setUserFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All users</SelectItem>
                                                {mockUsers.map((user) => (
                                                    <SelectItem key={user.id} value={user.id}>
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Department</h4>
                                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All departments</SelectItem>
                                                {[...new Set(mockUsers.map((u) => u.department))].map((dept) => (
                                                    <SelectItem key={dept} value={dept}>
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="electric-filter"
                                            checked={isElectricFilter}
                                            onCheckedChange={(checked) => setIsElectricFilter(checked === true)}
                                        />
                                        <Label htmlFor="electric-filter" className="flex items-center gap-1">
                                            <Zap className="h-4 w-4 text-yellow-500"/>
                                            Electric Only
                                        </Label>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setStatusFilter("all")
                                                setDateFilter(undefined)
                                                setUserFilter("all")
                                                setDepartmentFilter("all")
                                                setIsElectricFilter(false)
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
                    {/* "New Reservation" button removed for manager's reservation overview page */}
                </div>

                <Tabs defaultValue="list" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <List className="h-4 w-4"/>
                            List View
                        </TabsTrigger>
                        <TabsTrigger value="map" className="flex items-center gap-2">
                            <Map className="h-4 w-4"/>
                            Parking Map
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="list" className="space-y-4">
                        {filteredReservations.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="rounded-full bg-muted p-3 mb-3">
                                        <Car className="h-6 w-6 text-muted-foreground"/>
                                    </div>
                                    <h3 className="text-lg font-medium">No reservations found</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                        Try adjusting your filters or search query.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="border rounded-md">
                                <div
                                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 font-medium border-b bg-muted/50 text-sm">
                                    <div className="md:col-span-2">User</div>
                                    <div>Spot</div>
                                    <div>Date</div>
                                    <div>Time</div>
                                    <div>Status</div>
                                    {/* Actions column header removed or repurposed if view-only actions exist */}
                                </div>
                                <div className="divide-y">
                                    {filteredReservations.map((reservation) => (
                                        <div
                                            key={reservation.id}
                                            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center text-sm"
                                        >
                                            <div className="md:col-span-2">
                                                <div className="font-medium">{reservation.userName}</div>
                                                <div
                                                    className="text-xs text-muted-foreground">{reservation.userDepartment}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {reservation.spot}
                                                {reservation.isElectric && <Zap className="h-4 w-4 text-yellow-500"/>}
                                            </div>
                                            <div>{reservation.date}</div>
                                            <div>{reservation.time.split(" (")[0]}</div>
                                            <div>
                                                <Badge
                                                    variant={
                                                        reservation.status === "active"
                                                            ? "default"
                                                            : reservation.status === "completed"
                                                                ? "secondary"
                                                                : "outline"
                                                    }
                                                >
                                                    {reservation.status === "active"
                                                        ? "Active"
                                                        : reservation.status === "completed"
                                                            ? "Checked In"
                                                            : "Upcoming"}
                                                </Badge>
                                            </div>
                                            {/* Action buttons removed for manager's view */}
                                            <div className="flex justify-end gap-2">
                                                {/* Placeholder for any view-only actions if needed in future */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="map" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Parking Map Overview</CardTitle>
                                <CardDescription>Visual representation of parking lot status for today</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ParkingMapOverview />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <Toaster/>
            {/* Edit/Create Reservation Dialogs removed */}
        </DashboardShell>
    )
}
