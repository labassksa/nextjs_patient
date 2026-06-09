import * as Sentry from "@sentry/nextjs";
import axios, { AxiosError } from "axios";

// Whether an HTTP status should be reported to Sentry.
// We capture 5xx (server errors) and 4xx (client errors) except 401,
// which is an expected auth expiry already handled with a redirect.
function shouldCaptureStatus(status: number | undefined): status is number {
  return !!status && status !== 401;
}

/**
 * Reports an axios error to Sentry.
 *
 * Errors with a response are captured by status (5xx as "error", 4xx as
 * "warning"), skipping 401. Errors without a response are network-level
 * failures (timeouts, DNS, ERR_NETWORK) and are captured as "error" — except
 * canceled/aborted requests, which are expected and ignored.
 */
export function captureAxiosError(error: AxiosError): void {
  const status = error.response?.status;

  if (error.response) {
    if (!shouldCaptureStatus(status)) return;

    Sentry.captureException(error, {
      level: status >= 500 ? "error" : "warning",
      tags: { http_status: status },
      extra: {
        api_url: error.config?.url,
        api_method: error.config?.method,
        response_data: error.response.data,
      },
    });
    return;
  }

  // No response: network error, timeout, or cancellation.
  if (axios.isCancel(error)) return;

  Sentry.captureException(error, {
    level: "error",
    tags: { error_code: error.code },
    extra: {
      api_url: error.config?.url,
      api_method: error.config?.method,
    },
  });
}

/**
 * Reports a failed fetch Response to Sentry. Unlike axios, fetch does not throw
 * on 4xx/5xx, so call this explicitly after checking `res.ok` in fetch-based code.
 */
export function captureFetchError(res: Response, body?: unknown): void {
  const status = res.status;
  if (!shouldCaptureStatus(status)) return;

  Sentry.captureException(
    new Error(`API ${status} ${res.statusText} for ${res.url}`),
    {
      level: status >= 500 ? "error" : "warning",
      tags: { http_status: status },
      extra: { api_url: res.url, response_data: body },
    }
  );
}

// Guards against stacking duplicate interceptors if this module re-executes
// (e.g. HMR in dev, or an accidental second import).
let globalAxiosCaptureRegistered = false;

/**
 * Registers a response interceptor on the default axios instance so that every
 * raw `axios.*` call across the app reports failures to Sentry. Call once at startup.
 */
export function registerGlobalAxiosErrorCapture(): void {
  if (globalAxiosCaptureRegistered) return;
  globalAxiosCaptureRegistered = true;

  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      captureAxiosError(error);
      return Promise.reject(error);
    }
  );
}
