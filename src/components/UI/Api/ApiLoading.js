import Box from '@mui/system/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ApiLoading = () => {
  return (
    <Box
      sx={{
        margin: 4,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default ApiLoading;
