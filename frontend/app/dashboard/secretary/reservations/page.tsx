'use client';
import {DashboardShell} from "@/components/dashboard-shell";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useToast} from "@/hooks/useToast";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {format} from "date-fns";
import {CalendarIcon, Car, Check, Edit, Filter, List, Map, Plus, Search, Trash, Zap} from "lucide-react"
import {useState, useEffect} from "react";
import {Calendar} from "@/components/ui/calendar";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {ParkingMapOverview} from "@/components/parking-map-overview";
import {Toaster} from "@/components/ui/sonner";
import {ReservationAction} from "./reservationAction";

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
    {
        id: "e1270421-4f89-4394-be0e-f8b44b14b6c8",
        name: "John Doe",
        email: "john.doe@company.com",
        department: "Engineering"
    },
    {
        id: "4d03f851-a89b-44b8-b830-fdf3766a4386",
        name: "Alice Smith",
        email: "alice.smith@company.com",
        department: "Administration"
    },
    {
        id: "20073cd6-43b4-4dd5-aa1e-a65fd14ca71a",
        name: "Bob Johnson",
        email: "bob.johnson@company.com",
        department: "Marketing"
    }
]

export default function SecretaryReservationsPage() {
    const {success} = useToast()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
    const [userFilter, setUserFilter] = useState("all")
    const [departmentFilter, setDepartmentFilter] = useState("all")
    const [isElectricFilter, setIsElectricFilter] = useState(false)

    // Mock data for reservations
    const [reservations, setReservations] = useState<Reservation[]>([])

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [reservationToEdit, setReservationToEdit] = useState<Reservation | null>(null)

    // Ajout d'un état pour les demandes de réservation (actions)
    const [reservationActions, setReservationActions] = useState<ReservationAction[]>([]);
    const [actionToEdit, setActionToEdit] = useState<ReservationAction | null>(null);
    const [acceptedRequests, setAcceptedRequests] = useState<number[]>([]);

    const secretaryId = "20073cd6-43b4-4dd5-aa1e-a65fd14ca71a"; // exemple statique, à adapter

    useEffect(() => {
        const refreshReservations = async () => {
            const pending = await ReservationAction.fetchPending(secretaryId);
            setReservationActions(pending);
            const confirmed = await ReservationAction.fetchAllConfirmed(secretaryId);
            setReservations(confirmed.map((r: any) => ({
                id: r.id,
                userId: r.userId,
                userName: r.userName,
                userDepartment: r.userDepartment,
                date: r.date,
                spot: r.spot,
                time: r.time,
                isElectric: r.isElectric,
                status: r.status,
                checkedIn: r.checkedIn,
            })));
        };
        refreshReservations();
    }, [secretaryId]);

    const handleCreateReservation = async (newReservationData: Omit<Reservation, "id" | "userName" | "userDepartment" | "status" | "checkedIn">) => {
        try {
            console.log("Creating reservation with data:", newReservationData);
            await ReservationAction.create(newReservationData);
            success("Votre réservation a bien été créée.");
            setIsCreateDialogOpen(false);
            // Rafraîchir les données
            const confirmed = await ReservationAction.fetchAllConfirmed(secretaryId);
            setReservations(confirmed.map((r: any) => ({
                id: r.id,
                userId: r.userId,
                userName: r.userName,
                userDepartment: r.userDepartment,
                date: r.date,
                spot: r.spot,
                time: r.time,
                isElectric: r.isElectric,
                status: r.status,
                checkedIn: r.checkedIn,
            })));
        } catch (e) {
            success("Erreur lors de la création de la réservation.");
        }
    };

    const handleEditReservation = (updatedReservationData: Omit<Reservation, "id" | "userName" | "userDepartment" | "status" | "checkedIn">) => {
        const user = mockUsers.find((u) => u.id === updatedReservationData.userId)
        setReservations(
            reservations.map((res) =>
                reservationToEdit && res.id === reservationToEdit.id
                    ? {
                        ...res,
                        ...updatedReservationData,
                        userName: user?.name || "",
                        userDepartment: user?.department || "",
                    }
                    : res,
            ),
        )

        success("Your parking reservation has been successfully updated. \n " +
            `Parking spot ${updatedReservationData.spot} has been reserved for ${updatedReservationData.userId}.`)
        setIsEditDialogOpen(false)
        setReservationToEdit(null)
    }

    const handleCancelReservation = async (id: number) => {
        try {
            if (ReservationAction.cancel) {
                await ReservationAction.cancel(String(id));
            }
            success("Votre réservation a bien été annulée.");
            // Rafraîchir les données
            const confirmed = await ReservationAction.fetchAllConfirmed(secretaryId);
            setReservations(confirmed.map((r: any) => ({
                id: r.id,
                userId: r.userId,
                userName: r.userName,
                userDepartment: r.userDepartment,
                date: r.date,
                spot: r.spot,
                time: r.time,
                isElectric: r.isElectric,
                status: r.status,
                checkedIn: r.checkedIn,
            })));
        } catch (e) {
            success("Erreur lors de l'annulation de la réservation.");
        }
    };

    const handleCheckIn = async (id: number) => {
        try {
            await ReservationAction.checkIn(String(id));
            success("Check-in effectué avec succès.");
            // Rafraîchir les données
            const confirmed = await ReservationAction.fetchAllConfirmed(secretaryId);
            setReservations(confirmed.map((r: any) => ({
                id: r.id,
                userId: r.userId,
                userName: r.userName,
                userDepartment: r.userDepartment,
                date: r.date,
                spot: r.spot,
                time: r.time,
                isElectric: r.isElectric,
                status: r.status,
                checkedIn: r.checkedIn,
            })));
        } catch (e) {
            success("Erreur lors du check-in.");
        }
    };

    const handleAcceptAction = async (actionId: string) => {
        const action = reservationActions.find(a => a.id === actionId);
        console.log("Accepting action:", actionId);


        const success = await ReservationAction.acceptWithSpot(actionId)
        console.log("success:", success);

        if (success) {
            // Rafraîchir la liste des réservations confirmées
            const confirmed = await ReservationAction.fetchAllConfirmed(secretaryId);
            setReservations(confirmed.map((r: any) => ({
                id: r.id,
                userId: r.userId,
                userName: r.userName,
                userDepartment: r.userDepartment,
                date: r.date,
                spot: r.spot,
                time: r.time,
                isElectric: r.isElectric,
                status: r.status,
                checkedIn: r.checkedIn,
            })));
        }
    };

    // Filtrer les demandes à valider : uniquement celles des employés
    const filteredReservationActions = reservationActions.filter(a => a.type === "Employé");

    // Fusionne les réservations confirmées et les demandes en attente pour l'affichage dans la tab "list"
    const [allReservations, setAllReservations] = useState<any[]>([]);

    // Met à jour la liste triée après acceptation ou changement
    useEffect(() => {
        const merged = [
            ...reservations.map(r => ({
                id: r.id,
                userName: r.userName,
                userDepartment: r.userDepartment,
                spot: r.spot,
                date: r.date,
                dateObj: new Date(r.date),
                time: r.time,
                isElectric: r.isElectric,
                status: r.status,
                checkedIn: r.checkedIn,
                isRequest: false,
                vehicle: undefined,
                description: undefined,
            })),
            ...reservationActions.map(a => ({
                id: a.id,
                userName: '-',
                userDepartment: '-',
                spot: '-',
                date: a.date,
                dateObj: new Date(a.date),
                time: a.time,
                isElectric: false,
                status: (a.status === 'accepted' ? 'accepted' : 'pending'),
                checkedIn: false,
                isRequest: a.status !== 'accepted',
                vehicle: a.vehicle,
                description: a.description,
            }))
        ];
        setAllReservations(merged);
    }, [reservations, reservationActions]);

    // Trie la liste uniquement après acceptation
    const sortedReservations = [...allReservations].sort((a, b) => {
        if (a.status === 'accepted' && b.status !== 'accepted') return 1;
        if (a.status !== 'accepted' && b.status === 'accepted') return -1;
        return a.dateObj.getTime() - b.dateObj.getTime();
    });

    const filteredReservations = sortedReservations.filter((reservation) => {
        const matchesSearch =
            searchQuery === "" ||
            reservation.spot.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reservation.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reservation.date.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
        const matchesDate = !dateFilter || reservation.date === format(dateFilter, "MMM d, yyyy")
        const matchesUser = userFilter === "all" || reservation.userName === userFilter
        const matchesDepartment = departmentFilter === "all" || reservation.userDepartment === departmentFilter
        const matchesElectric = !isElectricFilter || reservation.isElectric === isElectricFilter

        return matchesSearch && matchesStatus && matchesDate && matchesUser && matchesDepartment && matchesElectric
    })

    return (
        <DashboardShell
            title="Manage Reservations"
            description="View, create, edit, and cancel parking reservations for all users"
            userRole="Secretary"
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
                                                {mockUsers.map((user: User) => (
                                                    <SelectItem key={user.id} value={user.name}>
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
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4"/>
                                New Reservation
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create New Reservation</DialogTitle>
                                <DialogDescription>Select a user, date, and preferences for the parking
                                    reservation.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <ReservationForm onSubmit={handleCreateReservation} users={mockUsers}/>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs defaultValue="list" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <List className="h-4 w-4"/>
                            List View
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4"/>
                            Calendar View
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
                                    className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 font-medium border-b bg-muted/50 text-sm">
                                    <div className="md:col-span-2">User</div>
                                    <div>Spot</div>
                                    <div>Date</div>
                                    <div>Time</div>
                                    <div>Status</div>
                                    <div className="text-right">Actions</div>
                                </div>
                                <div className="divide-y">
                                    {filteredReservations.map((reservation) => (
                                        <div
                                            key={reservation.id}
                                            className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 items-center text-sm"
                                        >
                                            <div className="md:col-span-2">
                                                <div className="font-medium">{reservation.userName}</div>
                                                <div
                                                    className="text-xs text-muted-foreground">{reservation.userDepartment}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {typeof reservation.spot === 'object' && reservation.spot !== null
                                                    ? (reservation.spot.spotNumber || reservation.spot.id || '-')
                                                    : (reservation.spot || '-')}
                                                {reservation.isElectric && <Zap className="h-4 w-4 text-yellow-500"/>}
                                            </div>
                                            <div>{reservation.date}</div>
                                            <div>{reservation.time && reservation.time.split ? reservation.time.split(" (", 1)[0] : reservation.time || ""}</div>
                                            <div>
                                                <Badge
                                                    variant={
                                                        reservation.status === "active"
                                                            ? "default"
                                                            : reservation.status === "completed"
                                                                ? "secondary"
                                                                : reservation.status === "pending"
                                                                    ? "destructive"
                                                                    : reservation.status === "accepted"
                                                                        ? "success"
                                                                        : "outline"
                                                    }
                                                >
                                                    {reservation.status === "active"
                                                        ? "Active"
                                                        : reservation.status === "completed"
                                                            ? "Checked In"
                                                            : reservation.status === "pending"
                                                                ? "Pending"
                                                                : reservation.status === "accepted"
                                                                    ? "Accepted"
                                                                    : "Upcoming"}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                {/* Actions pour les demandes en attente ou acceptées */}
                                                {(reservation.status === "pending" || reservation.status === "accepted") ? (
                                                    <>
                                                        {reservation.status === "pending" && (
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleAcceptAction(String(reservation.id))}
                                                            >
                                                                Accept
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1"
                                                            onClick={() => {
                                                                const action = reservationActions.find(a => a.id === reservation.id);
                                                                if (action) {
                                                                    setActionToEdit(action);
                                                                    setIsEditDialogOpen(true);
                                                                }
                                                            }}
                                                        >
                                                            <Edit className="h-3 w-3"/>
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="gap-1"
                                                            onClick={() => handleCancelReservation(reservation.id)}
                                                        >
                                                            <Trash className="h-3 w-3"/>
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {!reservation.checkedIn && reservation.status === "active" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-1"
                                                                onClick={() => handleCheckIn(reservation.id)}
                                                            >
                                                                <Check className="h-3 w-3"/>
                                                                Check In
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1"
                                                            onClick={() => {
                                                                const res = reservations.find(r => r.id === reservation.id);
                                                                if (res) {
                                                                    setReservationToEdit(res);
                                                                    setIsEditDialogOpen(true);
                                                                }
                                                            }}
                                                        >
                                                            <Edit className="h-3 w-3"/>
                                                            Edit
                                                        </Button>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="destructive" size="sm"
                                                                        className="gap-1">
                                                                    <Trash className="h-3 w-3"/>
                                                                    Cancel
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Cancel Reservation</DialogTitle>
                                                                    <DialogDescription>
                                                                        Are you sure you want to cancel this parking
                                                                        reservation
                                                                        for {reservation.userName}?
                                                                        This action cannot be undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter className="mt-4">
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            document
                                                                                .querySelector("[data-dialog-close]")
                                                                                ?.dispatchEvent(new MouseEvent("click", {bubbles: true}))
                                                                        }}
                                                                    >
                                                                        Keep Reservation
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={() => {
                                                                            handleCancelReservation(reservation.id)
                                                                            document
                                                                                .querySelector("[data-dialog-close]")
                                                                                ?.dispatchEvent(new MouseEvent("click", {bubbles: true}))
                                                                        }}
                                                                    >
                                                                        Yes, Cancel
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="calendar" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reservation Calendar</CardTitle>
                                <CardDescription>View all reservations in a calendar format</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border mx-auto"
                                        classNames={{
                                            day_today: "bg-primary/10 text-primary font-bold",
                                            day_selected: "bg-primary text-primary-foreground",
                                        }}
                                        components={{
                                            DayContent: (props) => {
                                                const dateString = format(props.date, "MMM d, yyyy")
                                                const reservationsOnDay = reservations.filter((r) => r.date === dateString)
                                                return (
                                                    <div
                                                        className="relative h-full w-full p-2 flex items-center justify-center">
                                                        <div>{props.date.getDate()}</div>
                                                        {reservationsOnDay.length > 0 && (
                                                            <div
                                                                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-auto px-1 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                                                {reservationsOnDay.length}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            },
                                        }}
                                    />
                                    {date && (
                                        <div className="space-y-4">
                                            <h3 className="font-medium">Reservations
                                                for {format(date, "MMMM d, yyyy")}</h3>
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
                                                                        <span
                                                                            className="font-medium">Spot {reservation.spot}</span>
                                                                        <span
                                                                            className="text-sm text-muted-foreground">({reservation.userName})</span>
                                                                        {reservation.isElectric &&
                                                                            <Zap className="h-4 w-4 text-yellow-500"/>}
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
                                                <div className="text-center py-4 text-muted-foreground">No reservations
                                                    for this date</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="map" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Parking Map Overview</CardTitle>
                                <CardDescription>Visual representation of parking lot status
                                    (placeholder)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ParkingMapOverview reservations={reservations} users={mockUsers as User[]}/>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <Toaster/>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Reservation</DialogTitle>
                        <DialogDescription>Modifier la demande ou la réservation.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {reservationToEdit && (
                            <ReservationForm onSubmit={handleEditReservation} users={mockUsers}
                                             initialData={reservationToEdit}/>
                        )}
                        {actionToEdit && (
                            <Edit action={actionToEdit} onSubmit={handleEditReservation}
                                  onCancel={() => setIsEditDialogOpen(false)}/>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    )
}

// Reservation Form Component (for create/edit)
function ReservationForm({onSubmit, users, initialData = null}: {
    onSubmit: (data: any) => void,
    users: User[],
    initialData?: Partial<Reservation> | null
}) {
    const [userId, setUserId] = useState<string>(initialData?.userId || "")
    const [spot, setSpot] = useState<string>(initialData?.spot || "")
    const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : new Date())
    const [time, setTime] = useState<"full-day" | "morning" | "afternoon">(
        initialData?.time?.split(" (")[0].toLowerCase().replace(" ", "-") as "full-day" | "morning" | "afternoon" || "full-day"
    )

    const handleTimeChange = (value: string) => {
        setTime(value as "full-day" | "morning" | "afternoon")
    }
    const [isElectric, setIsElectric] = useState<boolean>(initialData?.isElectric || false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const timeSlotMap: Record<"full-day" | "morning" | "afternoon", string> = {
            "full-day": "Full day (8:00 AM - 6:00 PM)",
            morning: "Morning (8:00 AM - 1:00 PM)",
            afternoon: "Afternoon (1:00 PM - 6:00 PM)",
        }
        onSubmit({
            userId,
            spot,
            date: date ? format(date, "MMM d, yyyy") : "",
            time: timeSlotMap[time],
            isElectric,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="user">User</Label>
                <Select value={userId} onValueChange={setUserId} required>
                    <SelectTrigger id="user">
                        <SelectValue placeholder="Select user"/>
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user: User) => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.department})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="spot">Spot ID</Label>
                    <Input
                        id="spot"
                        value={spot}
                        onChange={(e) => setSpot(e.target.value.toUpperCase())}
                        placeholder="e.g. A01"
                        pattern="[A-F][0-9]{2}"
                        title="Spot ID must be a letter A-F followed by two digits (e.g., A01)"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {date ? format(date, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus/>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="time">Time Slot</Label>
                <Select value={time} onValueChange={handleTimeChange} required>
                    <SelectTrigger id="time">
                        <SelectValue placeholder="Select time slot"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="full-day">Full day</SelectItem>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is-electric-form"
                    checked={isElectric}
                    onCheckedChange={(checked) => setIsElectric(checked === true)}
                />
                <Label htmlFor="is-electric-form" className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500"/>
                    Electric Charging Spot
                </Label>
            </div>
            <DialogFooter className="pt-4">
                <Button type="submit">{initialData ? "Save Changes" : "Create Reservation"}</Button>
            </DialogFooter>
        </form>
    )
}
