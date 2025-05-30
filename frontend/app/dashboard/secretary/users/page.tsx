"use client"

import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {DashboardShell} from "@/components/dashboard-shell"
import {Badge} from "@/components/ui/badge"
import {Edit, Filter, Plus, Search, UserCog, UserX, Zap} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Label} from "@/components/ui/label"
import {Checkbox} from "@/components/ui/checkbox"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {useToast} from "@/hooks/useToast";
import {Toaster} from "@/components/ui/sonner";

// Types
interface Vehicle {
    make: string;
    model: string;
    licensePlate: string;
    isElectric: boolean;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: "Employee" | "Secretary" | "Manager";
    department: string;
    status: "active" | "inactive";
    vehicle: Vehicle;
    lastLogin: string;
}

// Mock data for users
const initialUsers: User[] = [
    {
        id: "user1",
        name: "John Doe",
        email: "john.doe@company.com",
        role: "Employee",
        department: "Engineering",
        status: "active",
        vehicle: {make: "Tesla", model: "Model 3", licensePlate: "EV-1234", isElectric: true},
        lastLogin: "May 25, 2025",
    },
    {
        id: "user2",
        name: "Alice Smith",
        email: "alice.smith@company.com",
        role: "Secretary",
        department: "Administration",
        status: "active",
        vehicle: {make: "Toyota", model: "Camry", licensePlate: "GAS-5678", isElectric: false},
        lastLogin: "May 26, 2025",
    },
    {
        id: "user3",
        name: "Bob Johnson",
        email: "bob.johnson@company.com",
        role: "Employee",
        department: "Marketing",
        status: "active",
        vehicle: {make: "Ford", model: "Mustang Mach-E", licensePlate: "EV-9012", isElectric: true},
        lastLogin: "May 24, 2025",
    },
    {
        id: "user4",
        name: "Emma Wilson",
        email: "emma.wilson@company.com",
        role: "Employee",
        department: "Finance",
        status: "inactive",
        vehicle: {make: "Honda", model: "Civic", licensePlate: "GAS-3456", isElectric: false},
        lastLogin: "Apr 10, 2025",
    },
    {
        id: "user5",
        name: "Mike Green",
        email: "mike.green@company.com",
        role: "Manager",
        department: "Executive",
        status: "active",
        vehicle: {make: "BMW", model: "i4", licensePlate: "EV-7890", isElectric: true},
        lastLogin: "May 26, 2025",
    },
]

export default function SecretaryUsersPage() {
    const {success} = useToast()
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [departmentFilter, setDepartmentFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const [isUserFormOpen, setIsUserFormOpen] = useState(false)
    const [userToEdit, setUserToEdit] = useState<User | null>(null)

    const handleUserFormSubmit = (userData: Omit<User, "id" | "status" | "lastLogin">) => {
        if (userToEdit) {
            // Edit user
            setUsers(users.map((user) => (user.id === userToEdit.id ? {...user, ...userData} : user)))
            success("User updated. \n " +
                `description ${userData.name}'s information has been updated.`)
        } else {
            // Add new user
            const newUser: User = {
                id: `user${Date.now()}`,
                ...userData,
                status: "active", // Default status for new users
                lastLogin: "Never", // Default last login for new users
            }
            setUsers([...users, newUser])
            success("User added. \n " +
                `description ${userData.name} has been added to the system.`)
        }
        setIsUserFormOpen(false)
        setUserToEdit(null)
    }

    const handleToggleUserStatus = (userId: string) => {
        setUsers(
            users.map((user) =>
                user.id === userId ? {...user, status: user.status === "active" ? "inactive" : "active"} : user,
            ),
        )
        const user = users.find((u) => u.id === userId)
        success("User status updated. \n " +
            `description ${user?.name} is now ${user?.status === "active" ? "inactive" : "active"}.`)
    }

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            searchQuery === "" ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.department.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter

        return matchesSearch && matchesRole && matchesDepartment && matchesStatus
    })
    return (
        <DashboardShell
            title="Manage Users"
            description="View, create, edit, and manage user accounts"
            userRole="Secretary"
        >
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex flex-1 items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search by name, email, department..."
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
                                        <h4 className="font-medium text-sm">Role</h4>
                                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All roles</SelectItem>
                                                <SelectItem value="Employee">Employee</SelectItem>
                                                <SelectItem value="Secretary">Secretary</SelectItem>
                                                <SelectItem value="Manager">Manager</SelectItem>
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
                                                {[...new Set(initialUsers.map((u) => u.department))].map((dept) => (
                                                    <SelectItem key={dept} value={dept}>
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Status</h4>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All statuses</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setRoleFilter("all")
                                                setDepartmentFilter("all")
                                                setStatusFilter("all")
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
                    <Button
                        className="gap-2"
                        onClick={() => {
                            setUserToEdit(null)
                            setIsUserFormOpen(true)
                        }}
                    >
                        <Plus className="h-4 w-4"/>
                        Add User
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="rounded-full bg-muted p-3 mb-3">
                                    <UserCog className="h-6 w-6 text-muted-foreground"/>
                                </div>
                                <h3 className="text-lg font-medium">No users found</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                    Try adjusting your filters or search query.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-muted/50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                        >
                                            User
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                        >
                                            Role
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                        >
                                            Department
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                        >
                                            Vehicle
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                        >
                                            Last Login
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-background divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Avatar className="h-10 w-10 mr-3">
                                                        <AvatarImage src={`/placeholder-user.jpg?query=${user.name}`}
                                                                     alt={user.name}/>
                                                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div
                                                            className="text-sm font-medium text-foreground">{user.name}</div>
                                                        <div
                                                            className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.department}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    {user.vehicle.make} {user.vehicle.model}
                                                    {user.vehicle.isElectric &&
                                                        <Zap className="h-4 w-4 text-yellow-500"/>}
                                                </div>
                                                <div className="text-xs">{user.vehicle.licensePlate}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                                    {user.status === "active" ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.lastLogin}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => {
                                                            setUserToEdit(user)
                                                            setIsUserFormOpen(true)
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4"/>
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleToggleUserStatus(user.id)}
                                                    >
                                                        {user.status === "active" ? (
                                                            <UserX className="h-4 w-4 text-destructive"/>
                                                        ) : (
                                                            <UserCog className="h-4 w-4 text-green-600"/>
                                                        )}
                                                        <span
                                                            className="sr-only">{user.status === "active" ? "Deactivate" : "Activate"}</span>
                                                    </Button>
                                                    {/* Add View Details and Delete buttons if needed */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Toaster/>

            {/* Add/Edit User Dialog */}
            <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{userToEdit ? "Edit User" : "Add New User"}</DialogTitle>
                        <DialogDescription>
                            {userToEdit ? "Update the user's information." : "Enter the details for the new user."}
                        </DialogDescription>
                    </DialogHeader>
                    <UserForm onSubmit={handleUserFormSubmit} initialData={userToEdit}/>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    )
}

// User Form Component (for create/edit)
function UserForm({onSubmit, initialData = null}: {
    onSubmit: (data: Omit<User, "id" | "status" | "lastLogin">) => void,
    initialData?: Partial<User> | null
}) {
    const [name, setName] = useState<string>(initialData?.name || "")
    const [email, setEmail] = useState<string>(initialData?.email || "")
    const [role, setRole] = useState<"Employee" | "Secretary" | "Manager">(initialData?.role || "Employee")
    const [department, setDepartment] = useState<string>(initialData?.department || "")
    const [vehicleMake, setVehicleMake] = useState<string>(initialData?.vehicle?.make || "")
    const [vehicleModel, setVehicleModel] = useState<string>(initialData?.vehicle?.model || "")
    const [vehicleLicensePlate, setVehicleLicensePlate] = useState<string>(initialData?.vehicle?.licensePlate || "")
    const [vehicleIsElectric, setVehicleIsElectric] = useState<boolean>(initialData?.vehicle?.isElectric || false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit({
            name,
            email,
            role,
            department,
            vehicle: {
                make: vehicleMake,
                model: vehicleModel,
                licensePlate: vehicleLicensePlate,
                isElectric: vehicleIsElectric,
            },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={v => setRole(v as "Employee" | "Secretary" | "Manager")}
                            required>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select role"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Employee">Employee</SelectItem>
                            <SelectItem value="Secretary">Secretary</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required/>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="vehicle-make">Make</Label>
                            <Input id="vehicle-make" value={vehicleMake}
                                   onChange={(e) => setVehicleMake(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vehicle-model">Model</Label>
                            <Input id="vehicle-model" value={vehicleModel}
                                   onChange={(e) => setVehicleModel(e.target.value)}/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vehicle-license">License Plate</Label>
                        <Input
                            id="vehicle-license"
                            value={vehicleLicensePlate}
                            onChange={(e) => setVehicleLicensePlate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="vehicle-electric"
                            checked={vehicleIsElectric}
                            onCheckedChange={(checked) => setVehicleIsElectric(checked === true)}
                        />
                        <Label htmlFor="vehicle-electric" className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-500"/>
                            Electric Vehicle
                        </Label>
                    </div>
                </CardContent>
            </Card>
            <DialogFooter className="pt-4">
                <Button type="submit">{initialData ? "Save Changes" : "Add User"}</Button>
            </DialogFooter>
        </form>
    )
}

