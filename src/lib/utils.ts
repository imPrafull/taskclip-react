import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getContrastTextClass = (color?: string, theme?: 'light' | 'dark') => {
  if (!color) return theme === 'dark' ? 'text-white' : 'text-gray-800';
  if (color.startsWith('bg-')) {
    return /yellow|amber|lime|\-100/.test(color) ? 'text-gray-800' : 'text-white';
  }
  try {
    let r = 0, g = 0, b = 0;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const bigint = parseInt(hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex, 16);
      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
    } else if (color.startsWith('rgb')) {
      const nums = color.replace(/[^0-9,]/g, '').split(',').map(n => parseInt(n, 10));
      [r, g, b] = nums;
    }
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 180 ? 'text-gray-800' : 'text-white';
  } catch (e) {
    return 'text-white';
  }
};