import { AuthApiResponse, AuthResponse, User } from "../models/auth";
import { storageService, USER_KEY, TOKEN_KEY } from "./storageService";
import { apiService } from "./apiService";

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
      storageService.setItem(USER_KEY, JSON.stringify(user));
      storageService.setItem(TOKEN_KEY, data.token);
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
      storageService.setItem(USER_KEY, JSON.stringify(user));
      storageService.setItem(TOKEN_KEY, data.token);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: (error as Error).message || "An unexpected error occurred." };
    }
  },

  logout: async () => {
    const token = apiService.getToken();
    if (token) {
      try {
        // We don't need to await this or handle its response for the user's logout flow.
        apiService.apiFetch("/users/logout", { method: "POST" });
        storageService.removeItem(USER_KEY);
        storageService.removeItem(TOKEN_KEY);
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }
  },

  getCurrentUser: (): User | null => {
    const userJson = storageService.getItem(USER_KEY);
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
