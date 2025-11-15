type User = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  success: boolean;
  user?: User;
  error?: string;
};

type ApiUser = {
  _id: string;
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type AuthApiResponse = {
  user: ApiUser;
  token: string;
};

const USER = "user";
const TOKEN = "token";
const API_BASE_URL = "http://localhost:3000";

export const authService = {
  signUp: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, error: "All fields are required" };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data: AuthApiResponse = await response.json();

      if (!response.ok) {
        return { success: false, error: (data as any).message || "Sign-up failed" };
      }

      const user: User = { id: data.user.id, name: data.user.name, email: data.user.email };
      localStorage.setItem(USER, JSON.stringify(user));
      localStorage.setItem(TOKEN, data.token);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred." };
    }
  },

  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    if (!email.trim() || !password.trim()) {
      return { success: false, error: "Email and password are required" };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: AuthApiResponse = await response.json();
      if (!response.ok) {
        return { success: false, error: (data as any).message || "Invalid email or password" };
      }
      const user: User = { id: data.user.id, name: data.user.name, email: data.user.email };
      localStorage.setItem(USER, JSON.stringify(user));
      localStorage.setItem(TOKEN, data.token);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred." };
    }
  },

  logout: async () => {
    const token = authService.getToken();
    localStorage.removeItem(USER);
    localStorage.removeItem(TOKEN);
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }
    
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(USER);
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

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN);
  },
};
