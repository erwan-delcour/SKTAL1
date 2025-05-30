import Link from 'next/link'

export default function FooterLayout() {
    return (
        <footer className="border-t w-full">
        <div className="flex flex-col items-center justify-evenly gap-4 md:h-16 md:flex-row">
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
    )
}