'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Инициализируем с темной темы по умолчанию
  const [theme, setTheme] = useState<Theme>(() => {
    // Пытаемся загрузить из localStorage только на клиенте
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
          return savedTheme;
        }
      } catch (e) {
        // Игнорируем ошибки localStorage
      }
    }
    return 'dark';
  });

  useEffect(() => {
    // Применяем тему к body при монтировании
    if (typeof window !== 'undefined') {
      document.body.setAttribute('data-theme', theme);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Применяем тему к body при изменении
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Игнорируем ошибки localStorage
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
