import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    // notify other hook instances in the same window
    window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<Theme>)?.detail;
      if (detail === 'light' || detail === 'dark') {
        if (detail !== theme) setTheme(detail);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newVal = e.newValue as Theme | null;
        if (newVal && newVal !== theme) setTheme(newVal);
      }
    };

    window.addEventListener('theme-change', onThemeChange as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('theme-change', onThemeChange as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
};
