import { frontendVersion } from '../../../helpers/constants';
import { showDebugInfo } from '../../../helpers/environment';
import { apiUrl } from '../../../helpers/environment';

import { Typography } from '@mui/material';

import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridTitle from '../../UI/Grid/GridTitle';

const FrontendStatus = () => {
  return (
    <GridItemContainer>
      <GridTitle title='Frontend Status' />

      <Typography variant='p' sx={{ my: 1 }} display='block'>
        Status: Available
      </Typography>

      <Typography variant='p' sx={{ my: 1 }} display='block'>
        Version: {frontendVersion}
      </Typography>

      <Typography variant='p' sx={{ my: 1 }} display='block'>
        API URL: {apiUrl}
      </Typography>

      <Typography variant='p' sx={{ my: 1 }} display='block'>
        Show Debug Info: {showDebugInfo ? 'Yes' : 'No'}
      </Typography>
    </GridItemContainer>
  );
};

export default FrontendStatus;
