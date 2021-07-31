import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://2a9294c2decc4d1c806fd0720f50204c@o719233.ingest.sentry.io/5780995',
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
