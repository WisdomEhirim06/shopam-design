import { NextRequest, NextResponse } from 'next/server';

// Force this route to always run dynamically — never cache responses.
// The proxy Vary header includes RSC and next-router-* headers, meaning
// Next.js could serve a cached 401 response to Axios requests (which carry
// those headers) while raw fetch() calls from the console get fresh upstream
// responses. force-dynamic + no-store prevents that split-cache behaviour.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const BACKEND = 'https://api.shopam.net';

// Headers that Next.js adds during proxying which cause DisallowedHost on the
// Django backend (it has USE_X_FORWARDED_HOST=True, ALLOWED_HOSTS=['.shopam.net']).
const DROP_REQUEST_HEADERS = new Set([
  // Let fetch set Host to match the target URL (api.shopam.net).
  // Forwarding Host: localhost:3000 causes nginx to redirect to www.shopam.net.
  'host',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-forwarded-port',
]);

const DROP_RESPONSE_HEADERS = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  // Node.js fetch auto-decompresses the body — forwarding content-encoding would
  // tell the browser to decompress an already-decompressed payload (corrupt data).
  'content-encoding',
  // Content-length reflects the compressed size; after decompression it no longer
  // matches and must be omitted so the browser measures the actual body size.
  'content-length',
]);

async function proxy(request: NextRequest, segments: string[]): Promise<NextResponse> {
  // Redirect email verification links back into the frontend verify page so the
  // user never lands on the raw DRF response.
  // Append a trailing slash if not already present — Django's APPEND_SLASH
  // expects it. We must not double-append: if the client URL already ends
  // with '/', the last element in segments will be an empty string, which
  // would produce a double slash (e.g. /api/commerce/cart/add//) causing
  // Django to issue a 308 redirect that strips the Authorization header,
  // resulting in a 401 even for authenticated requests.
  const rawPath = segments.join('/');
  const path = '/api/' + (rawPath.endsWith('/') ? rawPath : rawPath + '/');
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

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
    });

    // Buffer the full body before building the response — streaming upstream.body
    // directly into NextResponse causes silent truncation on some Node versions.
    const responseBody = await upstream.arrayBuffer();

    const responseHeaders = new Headers();
    upstream.headers.forEach((value, key) => {
      if (DROP_RESPONSE_HEADERS.has(key.toLowerCase())) return;

      if (key.toLowerCase() === 'set-cookie') {
        // The backend sets cookies with Domain=api.shopam.net.
        // The browser stores that cookie for api.shopam.net and NEVER sends it
        // back on requests to localhost:3000 — so the proxy never forwards the
        // cookie to the backend, the middleware sees no session, and returns 401.
        //
        // Fix: strip the Domain attribute so the browser scopes the cookie to
        // the proxy's own origin (localhost in dev, shopam.net in prod).
        // Also strip Secure so the cookie works over HTTP on localhost.
        // Use append (not set) so multiple Set-Cookie headers are all kept.
        const rewritten = value
          .split(';')
          .filter((part) => {
            const attr = part.trim().toLowerCase();
            // Strip Domain (would scope cookie to api.shopam.net, not localhost).
            // Strip Secure (HTTP on localhost doesn't qualify, and Chrome's
            // localhost exception only helps when SameSite=None is absent).
            // Strip SameSite (SameSite=None requires Secure; without it the
            // browser rejects the cookie entirely).
            return (
              !attr.startsWith('domain=') &&
              attr !== 'secure' &&
              !attr.startsWith('samesite=')
            );
          })
          .concat(['SameSite=Lax']) // Lax is correct for same-origin proxy requests
          .join('; ');
        responseHeaders.append('set-cookie', rewritten);
      } else {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error(`[proxy] ${request.method} ${target} →`, err);
    return NextResponse.json(
      { detail: 'Upstream unreachable' },
      { status: 502 }
    );
  }
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
