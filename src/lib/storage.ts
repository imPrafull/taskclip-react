export const USER = "user";
export const REFRESH_TOKEN = "refresh_token";
export const SORT_BY = 'taskListSortBy';
export const DETAIL_PINNED = 'taskDetailPinned';

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