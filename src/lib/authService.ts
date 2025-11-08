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

const STORAGE_KEY = "taskclip_auth_user";

export const authService = {
  signUp: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const existingUsersJson = localStorage.getItem("taskclip_users");
    const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : [];

    const userExists = existingUsers.find((u: any) => u.email === email);
    if (userExists) {
      return { success: false, error: "User already exists with this email" };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    };

    existingUsers.push(newUser);
    localStorage.setItem("taskclip_users", JSON.stringify(existingUsers));

    const user: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    return { success: true, user };
  },

  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    if (!email.trim() || !password.trim()) {
      return { success: false, error: "Email and password are required" };
    }

    const existingUsersJson = localStorage.getItem("taskclip_users");
    const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : [];

    const foundUser = existingUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: "Invalid email or password" };
    }

    const user: User = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    return { success: true, user };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(STORAGE_KEY);
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
