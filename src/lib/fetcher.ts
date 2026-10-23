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

let onUnauthorized: (() => void) | undefined;

export function setOnUnauthorized(handler: () => void) {
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
];

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
let refreshing: Promise<boolean> | undefined;

/** Refreshes a minute before the access cookie expires. */
export function scheduleRefresh(accessExpiresAt: string) {
  clearTimeout(refreshTimer);
  const wait = new Date(accessExpiresAt).getTime() - Date.now() - 60_000;
  refreshTimer = setTimeout(
    () => {
      void refreshSession();
    },
    Math.max(wait, 5_000),
  );
}

export function cancelRefresh() {
  clearTimeout(refreshTimer);
}

async function doRefresh(): Promise<boolean> {
  try {
    const res = await apiClient.post<{ access_expires_at: string }>(
      'auth/refresh',
    );
    scheduleRefresh(res.data.access_expires_at);
    return true;
  } catch {
    cancelRefresh();
    return false;
  }
}

/**
 * Trades the refresh cookie for new cookies. One refresh at a time per tab (a shared
 * promise) and across tabs (a Web Lock): two refreshes with the same cookie end the
 * session.
 */
export function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    const run =
      typeof navigator !== 'undefined' && navigator.locks
        ? navigator.locks.request('client-refresh', doRefresh)
        : doRefresh();
    refreshing = run.finally(() => {
      refreshing = undefined;
    });
  }
  return refreshing;
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
    const code = (error.response.data as ProblemBody | undefined)?.code;

    if (
      config &&
      code === 'auth.unauthenticated' &&
      !config._retried &&
      !NO_REFRESH.some((p) => url.startsWith(p))
    ) {
      config._retried = true;
      if (await refreshSession()) {
        return apiClient.request(config);
      }
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (axios.isAxiosError(err)) {
    const data = (err.response?.data ?? {}) as ProblemBody;
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
  },
): Promise<T> {
  try {
    const res = await apiClient.request({
      url,
      method: options?.method ?? 'GET',
      headers: options?.headers,
      data: options?.body,
      timeout: options?.timeout,
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
