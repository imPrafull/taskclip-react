import { storageService, REFRESH_TOKEN_KEY } from "../lib/storage";

export const API_BASE_URL = "http://localhost:3000";

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
            // include credentials in case refresh token is stored in an HttpOnly cookie
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
          this.setAccessToken(null);
          storageService.removeItem(REFRESH_TOKEN_KEY);
          return null;
        } finally {
          this._refreshPromise = null;
        }
      })();

      return this._refreshPromise;
    },
    /**
     * A wrapper around the native fetch function.
     * It automatically prepends the API_BASE_URL, adds the Authorization header,
     * and handles basic error responses.
     *
     * @param endpoint The API endpoint to call (e.g., '/users/login').
     * @param options The options for the fetch request (e.g., method, body).
     * @returns The JSON response data.
     * @throws An error if the network response is not ok.
     */
    apiFetch: async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      const attemptRequest = async (accessToken: string | null) => {
        const headers = new Headers(options.headers || {});
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }

        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: options.credentials ?? "same-origin",
        });

        const text = await response.text();
        let data: any = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text;
        }

        if (response.ok) return data as T;

        // If unauthorized, return a specific signal
        if (response.status === 401) {
          const err: any = new Error("Unauthorized");
          err.status = 401;
          err.data = data;
          throw err;
        }

        throw new Error((data as any)?.message || `HTTP error! status: ${response.status}`);
      };

      const token = apiService.getToken();
      try {
        return await attemptRequest(token);
      } catch (err: any) {
        if (err?.status === 401) {
          // try to refresh
          const newAccess = await apiService._refreshAccessToken();
          if (newAccess) {
            return await attemptRequest(newAccess);
          }
        }
        throw err;
      }
    },

    // (no-op) other helpers are defined above
}