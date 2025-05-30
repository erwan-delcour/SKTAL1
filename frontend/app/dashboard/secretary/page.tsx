"use client";

import {DashboardShell} from "@/components/dashboard-shell";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {CalendarDays, Settings, Users} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ReservationManagement} from "@/components/reservation-management";
import {AdminParkingMap} from "@/components/admin-parking-map";
import {UserManagement} from "@/components/user-management";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

export default function SecretaryDashboardPage() {
    return (
        <DashboardShell
            title="Secretary Dashboard"
            description="Manage parking reservations and users"
            userRole="Secretary"
        >
            <Tabs defaultValue="reservations" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="reservations" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Reservations
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="reservations" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">45</div>
                                <p className="text-xs text-muted-foreground">Active reservations for this week</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">15</div>
                                <p className="text-xs text-muted-foreground">Spots available for today</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Check-ins</CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">8</div>
                                <p className="text-xs text-muted-foreground">Reservations without check-in</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-1 md:col-span-2">
                            <CardHeader>
                                <CardTitle>Parking Map</CardTitle>
                                <CardDescription>Current parking status and reservations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AdminParkingMap />
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Reservations</CardTitle>
                            <CardDescription>View, edit, and create reservations for users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReservationManagement />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Add, edit, or remove users from the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserManagement />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                            <CardDescription>Configure system-wide settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reservation-limit">Employee Reservation Limit (days)</Label>
                                    <Input id="reservation-limit" type="number" defaultValue="5" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manager-limit">Manager Reservation Limit (days)</Label>
                                    <Input id="manager-limit" type="number" defaultValue="30" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="checkin-time">Check-in Deadline</Label>
                                    <Input id="checkin-time" type="time" defaultValue="11:00" />
                                </div>
                                <Button>Save Settings</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    );
}