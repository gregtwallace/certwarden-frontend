import { type FC, type ReactNode } from 'react';
import { type Theme } from '@mui/material';

import { createContext, useState } from 'react';
import {
  createTheme,
  ThemeProvider as ThemeProviderMui,
  useMediaQuery,
} from '@mui/material';

// context type
export type clientSettingsContextType = {
  showDebugInfo: boolean;
  toggleShowDebugInfo: () => void;
  themeIsDarkMode: boolean;
  toggleThemeIsDarkMode: () => void;
};

// create theme context
const ClientSettingsContext = createContext<clientSettingsContextType>({
  showDebugInfo: false,
  toggleShowDebugInfo: () => {
    /*no-op*/
  },

  themeIsDarkMode: false,
  toggleThemeIsDarkMode: () => {
    /*no-op*/
  },
});

// props type
type clientSettingsProviderType = {
  children: ReactNode;
};

// Theme Provider component
const ClientSettingsProvider: FC<clientSettingsProviderType> = ({
  children,
}) => {
  // Show Debug Info
  const localStorageShowDebugInfo: string | null =
    localStorage.getItem('show_debug_info');

  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(
    localStorageShowDebugInfo === 'true'
  );

  if (showDebugInfo) {
    console.log("Client show debug info is enabled. Go to 'Settings' if you want to turn it off.")
  }

  const toggleShowDebugInfo = (): void => {
    setShowDebugInfo((prevState) => {
      // reverse prior state
      const newState = !prevState;

      localStorage.setItem('show_debug_info', newState.toString());
      return newState;
    });
  };

  // Show Debug Info -- end

  // THEME
  // calculate initial theme
  let initialThemeIsDarkMode = false;
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
      const newState = !prevState;

      localStorage.setItem('theme_dark_mode', newState.toString());
      return newState;
    });
  };

  // create theme
  const theme: Theme = createTheme({
    palette: {
      mode: themeIsDarkMode ? 'dark' : 'light',
    },
  });
  // THEME -- end

  return (
    <ClientSettingsContext.Provider
      value={{
        showDebugInfo,
        toggleShowDebugInfo,
        themeIsDarkMode,
        toggleThemeIsDarkMode,
      }}
    >
      <ThemeProviderMui theme={theme}>{children}</ThemeProviderMui>
    </ClientSettingsContext.Provider>
  );
};

// exports
export { ClientSettingsContext, ClientSettingsProvider };
