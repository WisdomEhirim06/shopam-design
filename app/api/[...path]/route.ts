import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const BACKEND = 'https://api.shopam.net';

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
  'content-encoding',
  'content-length',
]);

async function proxy(request: NextRequest, segments: string[]): Promise<NextResponse> {
  const rawPath = segments.join('/');

  if (segments.some((s) => s === '.' || s === '..' || s.includes('..'))) {
    return NextResponse.json({ detail: 'Invalid path' }, { status: 400 });
  }

  const stripped = rawPath.replace(/\/+$/, '');
  const needsTrailingSlash =
    /^(accounts|notifications|posts|support)(\/|$)/.test(stripped) ||
    ['commerce/disputes', 'commerce/vendor/orders', 'commerce/vendors/reviews'].some(
      (p) => stripped === p || stripped.startsWith(p + '/')
    );
  const path = '/api/' + stripped + (needsTrailingSlash ? '/' : '');
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
        const isDev = process.env.NODE_ENV !== 'production';
        const rewritten = value
          .split(';')
          .filter((part) => {
            const attr = part.trim().toLowerCase();
            if (attr.startsWith('domain=')) return false;
            if (isDev && (attr === 'secure' || attr.startsWith('samesite='))) return false;
            return true;
          })
          .concat(isDev ? ['SameSite=Lax'] : [])
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
