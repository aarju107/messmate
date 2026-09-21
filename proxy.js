import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/app/lib/session';

// Optimistic check only: real authorization happens again inside every API route.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');
  const isStudentArea = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  if ((isAdminArea || isStudentArea) && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminArea && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isAuthPage && session) {
    const home = session.role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(home, request.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
