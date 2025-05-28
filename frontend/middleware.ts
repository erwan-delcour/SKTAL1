import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import { decodeTokenUnsafe, getRoleFromToken } from '@/lib/jwt';

// Mapping des rôles vers leurs dashboards autorisés
const roleAccess = {
    'manager': ['/dashboard/manager'],
    'secretary': ['/dashboard/secretary'],
    'user': ['/dashboard/employee'], // 'user' correspond à employee
} as const;

// Fonction pour obtenir le dashboard par défaut selon le rôle
function getDefaultDashboard(role: string): string {
    switch (role) {
        case 'manager':
            return '/dashboard/manager';
        case 'secretary':
            return '/dashboard/secretary';
        case 'user':
            return '/dashboard/employee';
        default:
            return '/dashboard/employee';
    }
}

// Fonction pour vérifier si un utilisateur a accès à une route
function hasAccess(role: string, pathname: string): boolean {
    const allowedPaths = roleAccess[role as keyof typeof roleAccess];
    if (!allowedPaths) return false;
    
    return allowedPaths.some(path => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Get authentication token from cookies
    const token = request.cookies.get('token')?.value;

    const isAuthenticated = !!token;
    let userRole: string | null = null;

    // Décoder le token pour extraire le rôle (sans vérification de signature)
    if (token) {
        userRole = getRoleFromToken(token);
        
        // Si le token n'est pas valide ou expiré
        if (!userRole) {
            if (pathname.startsWith('/dashboard')) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('token');
                return response;
            }
        }
    }

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!isAuthenticated) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Vérifier les permissions de rôle
        if (userRole && !hasAccess(userRole, pathname)) {
            // Rediriger vers le dashboard autorisé pour ce rôle
            const defaultDashboard = getDefaultDashboard(userRole);
            const redirectUrl = new URL(defaultDashboard, request.url);
            return NextResponse.redirect(redirectUrl);
        }

        // Si pas de rôle détecté, rediriger vers employee par défaut
        if (!userRole) {
            const defaultUrl = new URL('/dashboard/employee', request.url);
            return NextResponse.redirect(defaultUrl);
        }
    }

    // Redirect authenticated users away from login page
    if (pathname === '/login' && isAuthenticated && userRole) {
        const defaultDashboard = getDefaultDashboard(userRole);
        const dashboardUrl = new URL(defaultDashboard, request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
}