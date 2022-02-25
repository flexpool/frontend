import type { NextRequest, NextResponse } from 'next/server';

const BLOCKED_COUNTRY = 'RU';

export function middleware(req: NextRequest, res: NextResponse) {
  const country = req.geo?.country || 'US';

  if (
    req.nextUrl.pathname !== '/region-not-available' &&
    country === BLOCKED_COUNTRY
  ) {
    return new Response('Region not available', {
      status: 303,
      headers: {
        Location: '/region-not-available',
      },
    });
  }
}
