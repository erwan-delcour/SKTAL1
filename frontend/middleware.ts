import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Get authentication token from cookies
    const token = request.cookies.get('token')?.value;

    const isAuthenticated = token;

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!isAuthenticated) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect authenticated users away from login page
    if (pathname === '/login' && isAuthenticated) {
        const dashboardUrl = new URL('/dashboard/employee', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
}