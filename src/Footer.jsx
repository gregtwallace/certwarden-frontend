import { useContext } from 'react';
import { useTheme } from '@mui/material';
import { ThemeContext } from './context/ThemeProvider.tsx';

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const themeToggleIconProps = {
  fontSize: 'small',
};

const Footer = () => {
  const theme = useTheme();
  const { toggleThemeIsDarkMode } = useContext(ThemeContext);

  const isDarkTheme = theme.palette.mode === 'dark';

  return (
    <Box
      component='footer'
      sx={{
        py: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) =>
          isDarkTheme ? theme.palette.grey[800] : theme.palette.grey[300],
      }}
    >
      <Tooltip title='Toggle Theme'>
        <IconButton
          aria-label='toggletheme'
          onClick={toggleThemeIsDarkMode}
          sx={{
            position: 'absolute',
            p: 0,
            mx: 1,
          }}
        >
          {isDarkTheme ? (
            <Brightness4Icon {...themeToggleIconProps} />
          ) : (
            <Brightness7Icon {...themeToggleIconProps} />
          )}
        </IconButton>
      </Tooltip>

      <Typography variant='body2' align='center'>
        &copy; 2023 Greg T. Wallace
      </Typography>
    </Box>
  );
};

export default Footer;
