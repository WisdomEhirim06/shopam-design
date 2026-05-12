import { NextRequest, NextResponse } from 'next/server';

// Routes that require a logged-in session
const PROTECTED_PREFIXES = [
  '/cart',
  '/dashboard',
  '/profile',
  '/chats',
  '/orders',
];

// Routes only accessible when NOT logged in (redirect to /explore if already authenticated)
const AUTH_ONLY_PREFIXES = [
  '/auth/user-signin',
  '/auth/signin',
  '/auth/signup',
  '/auth/user-signup',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the lightweight session indicator cookie set by authService.login()
  const hasSession = !!request.cookies.get('shopam_session');

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !hasSession) {
    const dest = new URL('/auth/user-signin', request.url);
    dest.searchParams.set('redirect', pathname);
    return NextResponse.redirect(dest);
  }

  if (isAuthOnly && hasSession) {
    return NextResponse.redirect(new URL('/explore', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
