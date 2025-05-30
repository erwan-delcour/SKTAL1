import { Car } from "lucide-react";
import Link from "next/link";

export default function HeaderLayout() {
    return (
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
    );
}