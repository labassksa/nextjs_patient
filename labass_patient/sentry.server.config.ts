// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://308ee30882963474a796597239f77210@o4509283207217152.ingest.de.sentry.io/4509283209117776",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Do NOT send PII. This is a patient (healthcare) app, so request/response
  // bodies, cookies, headers and IPs may contain personal/medical data that must
  // not be forwarded to Sentry.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});
