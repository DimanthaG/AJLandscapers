'use client';

export const isBrowser = typeof window !== 'undefined';

export const safeNavigate = (path: string): void => {
  if (isBrowser) {
    window.location.href = path;
  }
};

export const safeGetPath = (): string => {
  if (isBrowser) {
    return window.location.pathname;
  }
  return '';
}; 