export const MOBILE_THEME_BREAKPOINT = 724;

export type Theme = 'dark' | 'light';

export function isMobileViewport(width: number): boolean {
  return width <= MOBILE_THEME_BREAKPOINT;
}

export function getDefaultTheme(width: number): Theme {
  return isMobileViewport(width) ? 'light' : 'dark';
}

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
  } catch {
    // ignore localStorage errors
  }

  return getDefaultTheme(window.innerWidth);
}
