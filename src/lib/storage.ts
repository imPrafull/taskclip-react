export const USER_KEY = "user";
export const TOKEN_KEY = "token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export const storageService = {
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  },

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },
};