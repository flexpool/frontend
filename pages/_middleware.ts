import { NextRequest, NextResponse } from 'next/server';
import { COOKIES_PREFERENCE_CURRENCY } from '@/constants';
import countries from '@/lib/countries';
const { get } = require('@vercel/edge-config');

const BLOCKED_COUNTRY = 'RU';

export async function middleware(req: NextRequest) {
  const sunset = await get('sunset');

  if (sunset === 'true') {
    // Return response with html content
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Site is down for maintenance</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
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
            .logo {
              display: block;
              margin: 0 auto;
              max-width: 100%;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .description {
              font-size: 16px;
              line-height: 1.5;
              margin: 20px 0;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="logo" src="/logo.png" alt="Logo">
            <div class="title">Site is down for maintenance</div>
            <div class="description">We are currently working on the site. We will be back soon.</div>
          </div>
        </body>
      </html>`,
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
