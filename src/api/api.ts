import { storageService, REFRESH_TOKEN_KEY, USER_KEY } from "../lib/storage";
import { authService } from "./auth";
import { toast } from "sonner";

export const API_BASE_URL = "http://localhost:3000";

// ---------------------------------------------------------------------------
// Slow-API toast helpers
// ---------------------------------------------------------------------------

let _slowToastShown = false;
let _slowToastId: string | number | null = null;
let _inflightCount = 0;
let _slowTimer: ReturnType<typeof setTimeout> | null = null;

function onRequestStart() {
  _inflightCount++;
  if (_inflightCount === 1 && !_slowToastShown) {
    _slowTimer = setTimeout(() => {
      if (_slowToastShown) return;
      _slowToastShown = true;
      _slowToastId = toast("Server is waking up", {
        description:
          "The API server is on a free tier and may take a minute to spin up. Please wait — your data is on its way!",
        duration: 70000,
        icon: "🌐",
        closeButton: true,
      });
    }, 5000);
  }
}

function onRequestEnd() {
  _inflightCount = Math.max(0, _inflightCount - 1);
  if (_inflightCount === 0) {
    if (_slowTimer) {
      clearTimeout(_slowTimer);
      _slowTimer = null;
    }
    if (_slowToastId !== null) {
      toast.dismiss(_slowToastId);
      _slowToastId = null;
    }
    // Reset so the toast can show again on the next request burst
    _slowToastShown = false;
  }
}

// ---------------------------------------------------------------------------
// Build request headers
// ---------------------------------------------------------------------------

function buildHeaders(base: HeadersInit | undefined, accessToken: string | null): Headers {
  const headers = new Headers(base || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return headers;
}

// ---------------------------------------------------------------------------
// Parse response body
// ---------------------------------------------------------------------------

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (response.ok) return data as T;

  if (response.status === 401) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    err.data = data;
    throw err;
  }

  throw new Error((data as any)?.message || `HTTP error! status: ${response.status}`);
}

export const apiService = {
    // Access token is kept in-memory to reduce XSS exposure.
    _accessToken: null as string | null,
    // A promise that represents an ongoing refresh operation to avoid duplicate refresh calls
    _refreshPromise: null as Promise<string | null> | null,

    setAccessToken(token: string | null) {
      this._accessToken = token;
    },

    getToken(): string | null {
      return this._accessToken;
    },

    // Try to refresh the access token. Returns the new access token or null if refresh failed.
    async _refreshAccessToken(): Promise<string | null> {
      if (this._refreshPromise) return this._refreshPromise;

      this._refreshPromise = (async () => {
        try {
          const refreshToken = storageService.getItem(REFRESH_TOKEN_KEY);
          const headers = new Headers({ "Content-Type": "application/json" });
          const body = refreshToken ? JSON.stringify({ refreshToken }) : undefined;

          const res = await fetch(`${API_BASE_URL}/users/refresh`, {
            method: "POST",
            headers,
            body,
            credentials: "include",
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error((data as any)?.message || `Refresh failed (${res.status})`);
          }

          const newAccess = (data as any).accessToken;
          const newRefresh = (data as any).refreshToken;
          if (newAccess) this.setAccessToken(newAccess);
          if (newRefresh) storageService.setItem(REFRESH_TOKEN_KEY, newRefresh);

          return newAccess || null;
        } catch (err) {
          apiService.setAccessToken(null);
          storageService.removeItem(USER_KEY);
          storageService.removeItem(REFRESH_TOKEN_KEY);
          if (typeof window !== "undefined") window.location.href = "/";
          return null;
        } finally {
          this._refreshPromise = null;
        }
      })();

      return this._refreshPromise;
    },

    async _attemptRequest<T>(endpoint: string, options: RequestInit, accessToken: string | null): Promise<T> {
      const headers = buildHeaders(options.headers, accessToken);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: options.credentials ?? "include",
      });
      return parseResponse<T>(response);
    },

    /**
     * A wrapper around the native fetch function.
     * It automatically prepends the API_BASE_URL, adds the Authorization header,
     * and handles token refresh on 401 responses.
     */
    apiFetch: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      const token = apiService.getToken();
      onRequestStart();

      try {
        const result = await apiService._attemptRequest<T>(endpoint, options, token);
        onRequestEnd();
        return result;
      } catch (err: any) {
        if (err?.status === 401) {
          // Keep inflight count up through the retry so the timer isn't killed prematurely
          const newAccess = await apiService._refreshAccessToken();
          if (newAccess) {
            try {
              const retried = await apiService._attemptRequest<T>(endpoint, options, newAccess);
              onRequestEnd();
              return retried;
            } catch (retryErr) {
              onRequestEnd();
              throw retryErr;
            }
          }
        }
        onRequestEnd();
        throw err;
      }
    },
}
