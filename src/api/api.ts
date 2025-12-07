import { storageService, TOKEN_KEY } from "../lib/storage";

export const API_BASE_URL = "http://localhost:3000";

export const apiService = {
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
    apiFetch: async <T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<T> => {
      const token = apiService.getToken();
    
      const headers = new Headers(options.headers || {});
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    
      const data = await response.json();
      
      if (!response.ok) {
        // Use the error message from the API response if available, otherwise a generic message.
        throw new Error((data as any)?.message || `HTTP error! status: ${response.status}`);
      }
    
      return data as T;
    },

    getToken: (): string | null => {
        return storageService.getItem(TOKEN_KEY);
    },
}