// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define protected and public routes
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  // Add more protected routes here
];

const adminRoutes = [
  '/admin',
  '/users',
  '/register/company', // Add company registration route
  '/auth/signup', // Add user signup route
  // Add more admin-only routes here
];

const publicRoutes = [
  '/',
  '/auth/signin',
  // Remove signup from public routes
  // Add more public routes here
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get token from cookies
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log('Middleware token:', token); // Add this line

  // Redirect logged-in users away from auth pages
  if (token && path.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect admin routes
  if (adminRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Protect regular protected routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};