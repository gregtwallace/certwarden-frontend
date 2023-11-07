import { type themeContextType } from '../context/ThemeProvider';

import { useContext } from 'react';

import { ThemeContext } from '../context/ThemeProvider';

const useTheme = (): themeContextType => {
  return useContext(ThemeContext);
};

export default useTheme;
