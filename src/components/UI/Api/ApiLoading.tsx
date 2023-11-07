import { type FC } from 'react';

import Box from '@mui/system/Box';
import CircularProgress from '@mui/material/CircularProgress';

// no props

// component
const ApiLoading: FC = () => {
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
