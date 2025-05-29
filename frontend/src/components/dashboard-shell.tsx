"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Calendar, Car, Home, LineChart, LogOut, Menu, Settings, User, Users } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
  title: string
  description: string
  userRole: "Employee" | "Secretary" | "Manager"
}

export function DashboardShell({ children, title, description, userRole }: DashboardShellProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: `/dashboard/${userRole.toLowerCase()}`,
      active: pathname === `/dashboard/${userRole.toLowerCase()}`,
    },
    {
      label: "Reservations",
      icon: Calendar,
      href: `/dashboard/${userRole.toLowerCase()}/reservations`,
      active: pathname === `/dashboard/${userRole.toLowerCase()}/reservations`,
    },
    {
      label: "Profile",
      icon: User,
      href: `/dashboard/${userRole.toLowerCase()}/profile`,
      active: pathname === `/dashboard/${userRole.toLowerCase()}/profile`,
    },
  ]

  // Add role-specific routes
  if (userRole === "Secretary") {
    routes.push({
      label: "Users",
      icon: Users,
      href: `/dashboard/${userRole.toLowerCase()}/users`,
      active: pathname === `/dashboard/${userRole.toLowerCase()}/users`,
    })
  }

  if (userRole === "Manager") {
    routes.push({
      label: "Analytics",
      icon: LineChart,
      href: `/dashboard/${userRole.toLowerCase()}/analytics`,
      active: pathname === `/dashboard/${userRole.toLowerCase()}/analytics`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-6">
        <div className="flex h-auto w-auto items-center justify-between py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <nav className="flex flex-col gap-4 py-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md",
                        route.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Car className="h-6 w-6" />
              <span>ParkEase</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>
                      {userRole === "Employee" ? "JD" : userRole === "Secretary" ? "AS" : "MG"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {userRole === "Employee" ? "John Doe" : userRole === "Secretary" ? "Alice Smith" : "Mike Green"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <Link href={`/dashboard/${userRole.toLowerCase()}/profile`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <Link href="/logout">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[240px] flex-col border-r md:flex">
          <nav className="flex flex-col gap-2 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md",
                  route.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
