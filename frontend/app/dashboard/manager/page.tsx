import {DashboardShell} from "@/components/dashboard-shell";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {CalendarDays, LineChart, Zap} from "lucide-react";
import {ManagerReservationForm} from "@/components/manager-reservation-form";

export default function ManagerDashboardPage() {
    return (
        <DashboardShell
            title="Manager Dashboard"
            description="View parking analytics and make reservations"
            userRole="Manager">
            <Tabs defaultValue="analytics" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="reserve" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Reserve
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
                                <LineChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">78%</div>
                                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
                                <LineChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12%</div>
                                <p className="text-xs text-muted-foreground">-2.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Electric Usage</CardTitle>
                                <Zap className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">85%</div>
                                <p className="text-xs text-muted-foreground">+12.3% from last month</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Weekly Occupancy</CardTitle>
                                <CardDescription>Parking lot usage over the past week</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {/*<OccupancyChart />*/}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Usage by Department</CardTitle>
                                <CardDescription>Distribution of parking usage</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {/*<UsageChart />*/}
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Electric Charging Usage</CardTitle>
                            <CardDescription>Utilization of electric charging spots</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {/*<ElectricUsageChart />*/}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reserve" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manager Reservation</CardTitle>
                            <CardDescription>Reserve a parking spot for up to 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ManagerReservationForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    );
}
