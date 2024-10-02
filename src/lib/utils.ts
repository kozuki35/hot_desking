import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateToLocalYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based index
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isAdmin = (): boolean => {
  const user = JSON.parse(localStorage.getItem('user') || '');

  return user.role === 'admin';
};

export const isUser = (): boolean => {
  const user = JSON.parse(localStorage.getItem('user') || '');

  return user.role === 'user';
};
