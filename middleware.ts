// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define route categories
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
];

const adminRoutes = [
  '/admin',
  '/admin/users',
  '/register/company',
  '/auth/signup',
];

const publicRoutes = [
  '/',
  '/auth/signin',
  '/payment',
  '/unauthorized',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect logged-in users away from auth pages
  if (token && path.startsWith('/auth/signin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect admin routes
  if (adminRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();
  }

  // Protect regular protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Check subscription for non-admin users
    if (token.role !== 'admin' && !token.hasActiveSubscription) {
      return NextResponse.redirect(
        new URL('/payment?reason=no_active_subscription', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};