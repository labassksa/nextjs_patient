// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { registerGlobalAxiosErrorCapture } from "@/lib/api/captureApiError";

Sentry.init({
  dsn: "https://308ee30882963474a796597239f77210@o4509283207217152.ingest.de.sentry.io/4509283209117776",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Do NOT send PII. This is a patient (healthcare) app, so request/response
  // bodies, cookies, headers and IPs may contain personal/medical data that must
  // not be forwarded to Sentry.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});

// Report failed API calls made through the default axios instance to Sentry.
registerGlobalAxiosErrorCapture();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
