import { ParkingLayout } from "@/components/parking-layout";
import { Button } from "@/components/ui/button";
import { CalendarDays, Car, LineChart, LogIn, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full items-center justify-center">
      <header className="border-b w-full justify-between">
        <div className="flex flex-row items-center justify-between mx-8 my-4">
          <div className="flex flex-row items-center gap-2 font-semibold">
            <Car className="h-6 w-6" />
            <span>ParkEase</span>
          </div>
          <nav className="flex w-auto flex-row items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="w-full">
        <section className="w-full py-12 bg-muted">
          <div className="grid grid-flow-col grid-rows-2 gap-4">
            <div className="">
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
          <div className="container px-4 md:px-6">
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
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground md:text-base">© 2025 ParkEase. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
