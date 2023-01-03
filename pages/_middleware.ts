import { NextRequest, NextResponse } from 'next/server';
import { COOKIES_PREFERENCE_CURRENCY } from '@/constants';
import countries from '@/lib/countries';

const BLOCKED_COUNTRY = 'RU';

export function middleware(req: NextRequest) {
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

  const response = NextResponse.next();

  const currencyPreference = req.cookies[COOKIES_PREFERENCE_CURRENCY];

  if (!currencyPreference) {
    const countryInfo = countries.find((x) => x.cca2 === country);
    const currencyCode = countryInfo
      ? Object.keys(countryInfo.currencies)[0]
      : 'usd';
    response.cookie(COOKIES_PREFERENCE_CURRENCY, currencyCode.toLowerCase());
  }

  return response;
}
