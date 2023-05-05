import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import {
  createTheme,
  ThemeProvider as ThemeProviderMui,
  useMediaQuery,
} from '@mui/material';

const ThemeModeContext = createContext();

// Global theme management
const ThemeProvider = (props) => {
  const [darkMode, setDarkMode] = useState(false);
  const [renderThemedItems, setRenderThemedItems] = useState(false);

  // handle dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prevState) => {
      localStorage.setItem('dark_mode', !prevState);
      return !prevState;
    });
  };

  const storageDarkMode = localStorage.getItem('dark_mode');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // only run this on very first render, then let state control
  useEffect(() => {
    let themeDarkMode = false;
    // use storage theme if exists
    if (storageDarkMode != null) {
      themeDarkMode = storageDarkMode === 'true';
    } else {
      // if no storage theme, check for sys preference dark
      if (prefersDarkMode) {
        themeDarkMode = true;
      }
    }
    // set storage theme
    localStorage.setItem('dark_mode', themeDarkMode);

    setDarkMode(themeDarkMode);
    setRenderThemedItems(true);
  }, [prefersDarkMode, storageDarkMode, setDarkMode]);

  // create theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    <>
      {renderThemedItems && (
        <ThemeModeContext.Provider value={toggleDarkMode}>
          <ThemeProviderMui theme={theme}>{props.children}</ThemeProviderMui>
        </ThemeModeContext.Provider>
      )}
    </>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

// exports
export { ThemeModeContext };
export default ThemeProvider;
