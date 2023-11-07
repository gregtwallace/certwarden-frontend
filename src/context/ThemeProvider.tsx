import { type FC, type ReactNode } from 'react';
import { type Theme } from '@mui/material';

import { createContext, useState } from 'react';
import {
  createTheme,
  ThemeProvider as ThemeProviderMui,
  useMediaQuery,
} from '@mui/material';

// context type
interface ThemeContextType {
  toggleThemeIsDarkMode: () => void;
}

// create theme context
const ThemeContext = createContext<ThemeContextType>({
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
  const localStorageThemeDarkMode: string | null =
    localStorage.getItem('theme_dark_mode');

  // if theme_dark_mode is set, use it
  if (localStorageThemeDarkMode !== null) {
    initialThemeIsDarkMode = localStorageThemeDarkMode === 'true';
  } else {
    // if theme_dark_mode is not set, use media query
    initialThemeIsDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  }

  // creat themeIsDarkMode state
  const [themeIsDarkMode, setThemeIsDarkMode] = useState<boolean>(
    initialThemeIsDarkMode
  );

  // toggle themeIsDarkMode
  const toggleThemeIsDarkMode = () => {
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
    <ThemeContext.Provider
      value={{ toggleThemeIsDarkMode: toggleThemeIsDarkMode }}
    >
      <ThemeProviderMui theme={theme}>{children}</ThemeProviderMui>
    </ThemeContext.Provider>
  );
};

// exports
export { ThemeContext };
export default ThemeProvider;
