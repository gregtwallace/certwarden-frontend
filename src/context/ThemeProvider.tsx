import { type FC, type ReactNode } from 'react';
import { type Theme } from '@mui/material';

import { createContext, useState } from 'react';
import {
  createTheme,
  ThemeProvider as ThemeProviderMui,
  useMediaQuery,
} from '@mui/material';

// context type
export type themeContextType = {
  themeIsDarkMode: boolean;
  toggleThemeIsDarkMode: () => void;
};

// create theme context
const ThemeContext = createContext<themeContextType>({
  themeIsDarkMode: false,
  toggleThemeIsDarkMode: () => {},
});

// props type
interface ThemeProviderPropsType {
  children: ReactNode;
}

// Theme Provider component
const ThemeProvider: FC<ThemeProviderPropsType> = ({ children }) => {
  // calculate initial theme
  let initialThemeIsDarkMode: boolean = false;
  const userPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const localStorageThemeDarkMode: string | null =
    localStorage.getItem('theme_dark_mode');

  // if storage is set, use it
  if (localStorageThemeDarkMode !== null) {
    initialThemeIsDarkMode = localStorageThemeDarkMode === 'true';
  } else {
    // if storage is not set, use media query
    initialThemeIsDarkMode = userPrefersDark;
  }

  // create themeIsDarkMode state
  const [themeIsDarkMode, setThemeIsDarkMode] = useState<boolean>(
    initialThemeIsDarkMode
  );

  // toggle themeIsDarkMode
  const toggleThemeIsDarkMode = (): void => {
    setThemeIsDarkMode((prevState) => {
      // reverse prior state
      const newIsDarkMode: boolean = !prevState;

      localStorage.setItem('theme_dark_mode', newIsDarkMode.toString());
      return newIsDarkMode;
    });
  };

  // create theme
  const theme: Theme = createTheme({
    palette: {
      mode: themeIsDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeContext.Provider value={{ themeIsDarkMode, toggleThemeIsDarkMode }}>
      <ThemeProviderMui theme={theme}>{children}</ThemeProviderMui>
    </ThemeContext.Provider>
  );
};

// exports
export { ThemeContext, ThemeProvider };
