import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box
      component='footer'
      sx={{
        py: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[800],
      }}
    >
      <Typography variant='body2' align='center'>
        Copyright © 2022 Greg T. Wallace
      </Typography>
    </Box>
  );
};

export default Footer;
