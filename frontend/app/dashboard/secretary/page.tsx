"use client";

import {DashboardShell} from "@/components/dashboard-shell";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {CalendarDays, Settings, Users} from "lucide-react";

export default function SecretaryDashboardPage() {
    return (
        <DashboardShell
            title="Secretary Dashboard"
            description="Manage parking reservations and users"
            userRole="Secretary">
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
            </Tabs>

        </DashboardShell>
    );
}