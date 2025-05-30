import FooterLayout from "@/components/footer-layout";
import HeaderLayout from "@/components/header-layout";
import { ParkingLayout } from "@/components/parking-layout";
import { Button } from "@/components/ui/button";
import { CalendarDays, Car, LineChart, LogIn, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col w-full items-center justify-center">
      <HeaderLayout />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="px-4 md:px-12">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Parking Reservation System
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simplify your parking experience with our easy-to-use reservation system. Reserve your spot, check in
                  when you arrive, and manage your parking needs all in one place.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="gap-1">
                      <LogIn className="h-4 w-4" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <ParkingLayout className="w-full max-w-[500px] h-auto" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Easy Reservations</h3>
                <p className="text-muted-foreground">
                  Book your parking spot up to 5 days in advance with just a few clicks.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Electric Vehicle Support</h3>
                <p className="text-muted-foreground">
                  Dedicated spots with free charging for electric and hybrid vehicles.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-muted-foreground">
                  Different views and permissions for employees, secretaries, and managers.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <LineChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Usage Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive dashboards to track parking usage and optimize resources.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterLayout />
    </div>
  );
}
