import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box
      component='footer'
      sx={{
        py: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth='sm'>
        <Typography variant='body2' align='center'>
          Copyright © 2022 Greg T. Wallace
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
