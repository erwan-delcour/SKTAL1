"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/useToast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BellRing, Car, ChevronRight, Mail, Settings, User, Zap } from "lucide-react"

export default function EmployeeProfilePage() {
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "555-123-4567",
    department: "Engineering",
    employeeId: "EMP-2023-0042",
  })

  const [vehicleInfo, setVehicleInfo] = useState({
    make: "Tesla",
    model: "Model 3",
    color: "Blue",
    licensePlate: "EV-1234",
    isElectric: true,
  })

  const [notifications, setNotifications] = useState({
    reservationConfirmation: true,
    reservationReminder: true,
    checkInReminder: true,
    spotAvailable: false,
    marketingEmails: false,
  })

  const [preferences, setPreferences] = useState({
    preferredSpotArea: "entrance",
    defaultTimeSlot: "full-day",
  })
  // Handle form submission
  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      success("Your personal information has been updated successfully.")
    }, 1000)
  }

  const handleVehicleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      success("Your vehicle information has been updated successfully.")
    }, 1000)
  }

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      success("Your notification preferences have been updated successfully.")
    }, 1000)
  }

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      success("Your parking preferences have been updated successfully.")
    }, 1000)
  }

  return (
    <DashboardShell title="My Profile" description="Manage your account settings and preferences" userRole="Employee">
      <div className="space-y-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <Card className="md:max-w-[300px] lg:max-w-[400px] w-full">
            <CardHeader>
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" alt={`${personalInfo.firstName} ${personalInfo.lastName}`} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold">{`${personalInfo.firstName} ${personalInfo.lastName}`}</h2>
                  <p className="text-sm text-muted-foreground">{personalInfo.department}</p>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{personalInfo.email}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-xs text-muted-foreground">Manage your notification preferences</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Account Settings</p>
                      <p className="text-xs text-muted-foreground">Manage your account settings</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Personal Info</span>
                  <span className="md:hidden">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="vehicle" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="hidden md:inline">Vehicle Info</span>
                  <span className="md:hidden">Vehicle</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                  <span className="md:hidden">Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden md:inline">Preferences</span>
                  <span className="md:hidden">Prefs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form id="personal-form" onSubmit={handlePersonalInfoSubmit}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input
                            id="first-name"
                            value={personalInfo.firstName}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input
                            id="last-name"
                            value={personalInfo.lastName}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={personalInfo.email}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={personalInfo.phone}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={personalInfo.department}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, department: e.target.value })}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employee-id">Employee ID</Label>
                          <Input id="employee-id" value={personalInfo.employeeId} disabled />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" form="personal-form" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="vehicle">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                    <CardDescription>Update your vehicle details for parking.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form id="vehicle-form" onSubmit={handleVehicleInfoSubmit}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="make">Make</Label>
                          <Input
                            id="make"
                            value={vehicleInfo.make}
                            onChange={(e) => setVehicleInfo({ ...vehicleInfo, make: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model</Label>
                          <Input
                            id="model"
                            value={vehicleInfo.model}
                            onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color">Color</Label>
                          <Input
                            id="color"
                            value={vehicleInfo.color}
                            onChange={(e) => setVehicleInfo({ ...vehicleInfo, color: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="license-plate">License Plate</Label>
                          <Input
                            id="license-plate"
                            value={vehicleInfo.licensePlate}
                            onChange={(e) => setVehicleInfo({ ...vehicleInfo, licensePlate: e.target.value })}
                          />
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-2">
                          <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="is-electric" className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              Electric Vehicle
                            </Label>
                            <Switch
                              id="is-electric"
                              checked={vehicleInfo.isElectric}
                              onCheckedChange={(checked) => setVehicleInfo({ ...vehicleInfo, isElectric: checked })}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Electric vehicles can park in rows A and F with free charging stations.
                          </p>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" form="vehicle-form" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications and alerts.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form id="notifications-form" onSubmit={handleNotificationsSubmit}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="reservation-confirmation">Reservation Confirmation</Label>
                            <p className="text-xs text-muted-foreground">
                              Receive a confirmation email when you make a reservation
                            </p>
                          </div>
                          <Switch
                            id="reservation-confirmation"
                            checked={notifications.reservationConfirmation}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, reservationConfirmation: checked })
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="reservation-reminder">Reservation Reminder</Label>
                            <p className="text-xs text-muted-foreground">
                              Receive a reminder email the day before your reservation
                            </p>
                          </div>
                          <Switch
                            id="reservation-reminder"
                            checked={notifications.reservationReminder}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, reservationReminder: checked })
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="check-in-reminder">Check-in Reminder</Label>
                            <p className="text-xs text-muted-foreground">
                              Receive a reminder to check-in to your parking spot
                            </p>
                          </div>
                          <Switch
                            id="check-in-reminder"
                            checked={notifications.checkInReminder}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, checkInReminder: checked })
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="spot-available">Spot Available Alerts</Label>
                            <p className="text-xs text-muted-foreground">
                              Receive alerts when parking spots become available
                            </p>
                          </div>
                          <Switch
                            id="spot-available"
                            checked={notifications.spotAvailable}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, spotAvailable: checked })
                            }
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <Label htmlFor="marketing-emails">Marketing Emails</Label>
                            <p className="text-xs text-muted-foreground">
                              Receive emails about new features and updates
                            </p>
                          </div>
                          <Switch
                            id="marketing-emails"
                            checked={notifications.marketingEmails}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, marketingEmails: checked })
                            }
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" form="notifications-form" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Parking Preferences</CardTitle>
                    <CardDescription>Set your default preferences for parking reservations.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form id="preferences-form" onSubmit={handlePreferencesSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferred-spot-area">Preferred Parking Area</Label>
                          <Select
                            value={preferences.preferredSpotArea}
                            onValueChange={(value) => setPreferences({ ...preferences, preferredSpotArea: value })}
                          >
                            <SelectTrigger id="preferred-spot-area">
                              <SelectValue placeholder="Select preferred area" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any available spot</SelectItem>
                              <SelectItem value="entrance">Near entrance (A01-A10, F01-F10)</SelectItem>
                              <SelectItem value="middle">Middle section (B01-B10, E01-E10)</SelectItem>
                              <SelectItem value="back">Back section (C01-C10, D01-D10)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            This will be your default preference when making reservations.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="default-time-slot">Default Time Slot</Label>
                          <Select
                            value={preferences.defaultTimeSlot}
                            onValueChange={(value) => setPreferences({ ...preferences, defaultTimeSlot: value })}
                          >
                            <SelectTrigger id="default-time-slot">
                              <SelectValue placeholder="Select default time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-day">Full day (8:00 AM - 6:00 PM)</SelectItem>
                              <SelectItem value="morning">Morning (8:00 AM - 1:00 PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (1:00 PM - 6:00 PM)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            This will be your default time slot when making reservations.
                          </p>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" form="preferences-form" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>            </Tabs>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
