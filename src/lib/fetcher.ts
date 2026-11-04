import axios, { type AxiosRequestConfig } from 'axios';
import type * as z from 'zod';
import i18n from './i18n';

/** One field error of the API's problem body. */
export interface FieldProblem {
  location: string;
  message: string;
}

/** Every API error, parsed from application/problem+json. Branch on `code`. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly errors: FieldProblem[];
  /** Seconds from Retry-After (429, a locked account). */
  readonly retryAfter?: number;

  constructor(init: {
    message: string;
    status: number;
    code: string;
    requestId?: string;
    errors?: FieldProblem[];
    retryAfter?: number;
  }) {
    super(init.message);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = init.code;
    this.requestId = init.requestId;
    this.errors = init.errors ?? [];
    this.retryAfter = init.retryAfter;
  }
}

interface ProblemBody {
  status?: number;
  title?: string;
  code?: string;
  detail?: string;
  request_id?: string;
  errors?: FieldProblem[];
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  // Access, refresh and device cookies are HttpOnly and set by the API.
  withCredentials: true,
});

/**
 * Which sign-in a call belongs to. A bond issuer's member signs in on this web too, with
 * cookies of their own: their calls (/auth/issuer/*, /issuer/*) refresh through
 * /auth/issuer/refresh, every other call through the client's /auth/refresh.
 */
export type Portal = 'client' | 'issuer';

const REFRESH_URL: Record<Portal, string> = {
  client: 'auth/refresh',
  issuer: 'auth/issuer/refresh',
};

export function portalOf(url: string): Portal {
  return url.startsWith('issuer/') || url.startsWith('auth/issuer/')
    ? 'issuer'
    : 'client';
}

let onUnauthorized: ((portal: Portal) => void) | undefined;

export function setOnUnauthorized(handler: (portal: Portal) => void) {
  onUnauthorized = handler;
}

// Calls that must never trigger a refresh: they either sign in or are the refresh.
const NO_REFRESH = [
  'auth/login',
  'auth/signup',
  'auth/otp/',
  'auth/password/forgot',
  'auth/password/verify',
  'auth/password/reset',
  'auth/refresh',
  'auth/logout',
  'auth/issuer/login',
  'auth/issuer/refresh',
  'auth/issuer/logout',
];

const refreshTimers: Partial<Record<Portal, ReturnType<typeof setTimeout>>> =
  {};
const refreshing: Partial<Record<Portal, Promise<boolean>>> = {};

function scheduleFor(portal: Portal, accessExpiresAt: string) {
  clearTimeout(refreshTimers[portal]);
  const wait = new Date(accessExpiresAt).getTime() - Date.now() - 60_000;
  refreshTimers[portal] = setTimeout(
    () => {
      void refreshSession(portal);
    },
    Math.max(wait, 5_000),
  );
}

/** Refreshes a minute before the client access cookie expires. */
export function scheduleRefresh(accessExpiresAt: string) {
  scheduleFor('client', accessExpiresAt);
}

/** Refreshes a minute before the issuer access cookie expires. */
export function scheduleIssuerRefresh(accessExpiresAt: string) {
  scheduleFor('issuer', accessExpiresAt);
}

export function cancelRefresh(portal: Portal = 'client') {
  clearTimeout(refreshTimers[portal]);
}

async function doRefresh(portal: Portal): Promise<boolean> {
  try {
    const res = await apiClient.post<{ access_expires_at: string }>(
      REFRESH_URL[portal],
    );
    scheduleFor(portal, res.data.access_expires_at);
    return true;
  } catch {
    cancelRefresh(portal);
    return false;
  }
}

/**
 * Trades a refresh cookie for new cookies. One refresh at a time per tab (a shared
 * promise) and across tabs (a Web Lock): two refreshes with the same cookie end the
 * session.
 */
export function refreshSession(portal: Portal = 'client'): Promise<boolean> {
  let run = refreshing[portal];
  if (!run) {
    run = (
      typeof navigator !== 'undefined' && navigator.locks
        ? navigator.locks.request(`${portal}-refresh`, () => doRefresh(portal))
        : doRefresh(portal)
    ).finally(() => {
      refreshing[portal] = undefined;
    });
    refreshing[portal] = run;
  }
  return run;
}

type RetriableConfig = AxiosRequestConfig & { _retried?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }
    const config = error.config as RetriableConfig | undefined;
    const url = config?.url ?? '';
    const code = problemOf(error.response.data).code;

    if (
      config &&
      code === 'auth.unauthenticated' &&
      !config._retried &&
      !NO_REFRESH.some((p) => url.startsWith(p))
    ) {
      config._retried = true;
      const portal = portalOf(url);
      if (await refreshSession(portal)) {
        return apiClient.request(config);
      }
      onUnauthorized?.(portal);
    }
    return Promise.reject(error);
  },
);

/** A failed download carries its problem body as bytes; read it back as JSON. */
function problemOf(data: unknown): ProblemBody {
  if (data instanceof ArrayBuffer) {
    try {
      return JSON.parse(new TextDecoder().decode(data)) as ProblemBody;
    } catch {
      return {};
    }
  }
  return (data ?? {}) as ProblemBody;
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (axios.isAxiosError(err)) {
    const data = problemOf(err.response?.data);
    const retry = Number(err.response?.headers?.['retry-after']);
    if (!err.response) {
      return new ApiError({
        message: i18n.t('errors.network.unreachable'),
        status: 0,
        code: 'network.unreachable',
      });
    }
    return new ApiError({
      message: data.detail ?? data.title ?? i18n.t('apiError.generic'),
      status: err.response.status,
      code: data.code ?? 'unknown',
      requestId:
        data.request_id ?? err.response.headers?.['x-request-id'] ?? undefined,
      errors: data.errors,
      retryAfter: Number.isFinite(retry) && retry > 0 ? retry : undefined,
    });
  }
  return new ApiError({
    message:
      err instanceof Error ? err.message : i18n.t('apiError.genericShort'),
    status: 0,
    code: 'unknown',
  });
}

export default async function fetchAndValidate<T>(
  url: string,
  schema: z.ZodType<T> | undefined,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
    /** Per-request timeout in ms; overrides the client default (20s). */
    timeout?: number;
    /** 'arraybuffer' for downloads; JSON otherwise. */
    responseType?: 'json' | 'arraybuffer';
  },
): Promise<T> {
  try {
    const res = await apiClient.request({
      url,
      method: options?.method ?? 'GET',
      headers: options?.headers,
      data: options?.body,
      timeout: options?.timeout,
      responseType: options?.responseType ?? 'json',
    });

    if (!schema) {
      return res.data as T;
    }

    const result = schema.safeParse(res.data);
    if (!result.success) {
      throw new Error(result.error.message);
    }

    return result.data;
  } catch (err) {
    throw toApiError(err);
  }
}
