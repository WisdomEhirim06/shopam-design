import { NextRequest, NextResponse } from 'next/server';

// Force dynamic — never cache proxy responses. See app/api/[...path]/route.ts
// for the full explanation of why this is needed.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const BACKEND = 'https://api.shopam.net';

// Headers that Next.js adds during proxying which cause DisallowedHost on the
// Django backend (it has USE_X_FORWARDED_HOST=True, ALLOWED_HOSTS=['.shopam.net']).
const DROP_REQUEST_HEADERS = new Set([
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
  // Append a trailing slash if not already present — same logic as the main
  // api proxy. Unconditionally appending produces double slashes (e.g.
  // /admins/users//) when the client URL already ends with '/', causing Django
  // to issue a 308 redirect that strips the Authorization header → 401.
  const rawPath = segments.join('/');
  const path = '/admins/' + (rawPath.endsWith('/') ? rawPath : rawPath + '/');
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
        // Strip Domain=api.shopam.net so the cookie is scoped to the proxy's
        // own origin (localhost in dev). Also strip Secure (HTTP on localhost
        // doesn't qualify) and SameSite=None (requires Secure to be set).
        const rewritten = value
          .split(';')
          .filter((part) => {
            const attr = part.trim().toLowerCase();
            return (
              !attr.startsWith('domain=') &&
              attr !== 'secure' &&
              !attr.startsWith('samesite=')
            );
          })
          .concat(['SameSite=Lax'])
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
    console.error(`[admins-proxy] ${request.method} ${target} →`, err);
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
