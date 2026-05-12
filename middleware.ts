import { NextResponse } from 'next/server';

// Middleware is intentionally a passthrough.
// Route protection is handled client-side:
//   - Dashboard: app/dashboard/layout.tsx checks localStorage for access_token
//   - Cart: app/cart/page.tsx checks localStorage before fetching
// Token refresh + forced-logout on expiry is handled by the Axios interceptor
// in lib/api/config.ts. Mixing cookie-based middleware guards with
// localStorage-based token state caused redirect loops.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
