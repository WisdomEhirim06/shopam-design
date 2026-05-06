import { NextRequest, NextResponse } from 'next/server';

const BACKEND = 'https://api.shopam.net';

// Headers that Next.js adds during proxying which cause DisallowedHost on the
// Django backend (it has USE_X_FORWARDED_HOST=True, ALLOWED_HOSTS=['.shopam.net']).
const DROP_REQUEST_HEADERS = new Set([
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-forwarded-port',
]);

const DROP_RESPONSE_HEADERS = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  // Node.js fetch auto-decompresses the body, so forwarding these headers would
  // tell the browser to decompress an already-decompressed body.
  'content-encoding',
  'content-length', // length of the compressed payload no longer matches
]);

async function proxy(request: NextRequest, segments: string[]): Promise<NextResponse> {
  // Redirect email verification links back into the frontend verify page so the
  // user never lands on the raw DRF response. Requires the backend FRONTEND_URL
  // env var to be set to this app's origin (e.g. http://localhost:3000).
  if (
    request.method === 'GET' &&
    segments.join('/') === 'accounts/verify-email'
  ) {
    const token = request.nextUrl.searchParams.get('token');
    const dest = token
      ? `/auth/user-verify?token=${encodeURIComponent(token)}`
      : '/auth/user-verify';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  const path = '/api/' + segments.join('/') + '/';
  const search = request.nextUrl.search;
  const target = `${BACKEND}${path}${search}`;

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (!DROP_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!DROP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function OPTIONS(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
