import React, { createContext, useContext, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TEMPORANEO: Forza sempre tema dark per sviluppo
  const [theme] = useState<Theme>('dark');

  const toggleTheme = () => {
    // TEMPORANEO: Disabilitato durante lo sviluppo
    // setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = true; // TEMPORANEO: Sempre dark

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
