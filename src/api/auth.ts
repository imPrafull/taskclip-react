import { AuthApiResponse, AuthResponse, User } from "../models/auth";
import { storageService, USER, REFRESH_TOKEN } from "../lib/storage";
import { apiService } from "./api";

export const authService = {
  signUp: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, error: "All fields are required" };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    try {
      const data = await apiService.apiFetch<AuthApiResponse>("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const user: User = { id: data.user.id, name: data.user.name, email: data.user.email };
      storageService.setItem(USER, JSON.stringify(user));
      // Store access token in memory and refresh token in storage (or rely on cookie)
      apiService.setAccessToken((data as any).accessToken);
      if ((data as any).refreshToken) {
        storageService.setItem(REFRESH_TOKEN, (data as any).refreshToken);
      }
      return { success: true, user };
    } catch (error) {
      return { success: false, error: (error as Error).message || "An unexpected error occurred." };
    }
  },

  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    if (!email.trim() || !password.trim()) {
      return { success: false, error: "Email and password are required" };
    }
    try {
      const data = await apiService.apiFetch<AuthApiResponse>("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const user: User = { id: data.user.id, name: data.user.name, email: data.user.email };
      storageService.setItem(USER, JSON.stringify(user));
      apiService.setAccessToken((data as any).accessToken);
      if ((data as any).refreshToken) {
        storageService.setItem(REFRESH_TOKEN, (data as any).refreshToken);
      }
      return { success: true, user };
    } catch (error) {
      return { success: false, error: (error as Error).message || "An unexpected error occurred." };
    }
  },

  logout: async () => {
    // Use refresh token for logout if available, otherwise rely on cookie-based logout
    const refreshToken = storageService.getItem(REFRESH_TOKEN);
    try {
      await apiService.apiFetch("/users/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        // make sure cookies are sent if backend expects them
        credentials: "include",
      });
    } catch (error) {
      // still clear local state even if API call fails
      console.error("Logout API call failed:", error);
    }

    apiService.setAccessToken(null);
    storageService.removeItem(USER);
    storageService.removeItem(REFRESH_TOKEN);
  },

  getCurrentUser: (): User | null => {
    const userJson = storageService.getItem(USER);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },

};
