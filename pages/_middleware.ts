import { NextRequest, NextResponse } from 'next/server';
import { COOKIES_PREFERENCE_CURRENCY } from '@/constants';
import countries from '@/lib/countries';
const { get } = require('@vercel/edge-config');

const BLOCKED_COUNTRY = 'RU';

export async function middleware(req: NextRequest) {
  const sunset = await get('sunset');

  if (sunset === true) {
    // Return response with html content
    return new Response(
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />

    <title>Notice of Closure</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        background-color: #f6f6f6;
        color: #333;
        font-family: sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        margin: 0 auto;
        max-width: 600px;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h3>Notice of Closure</h3>
      <p>
        Flexpool.io was shut down on November 1st, 2023. Flexpool.io no longer
        operates any mining/farming pool services. Any outstanding balances are
        to be paid out shortly, within the week following the termination of
        Flexpool.io's mining/farming services.
      </p>
      <p>
        To continue your mining/farming operations, you need to switch to
        another pool if you have not done it by the closure date as initially
        recommended.
      </p>
    </div>
  </body>
</html>
`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }

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
