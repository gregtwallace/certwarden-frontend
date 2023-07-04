import { frontendVersion } from '../../../helpers/constants';
import { devMode } from '../../../helpers/environment';
import { apiUrl } from '../../../helpers/environment';

import { Link, Typography } from '@mui/material';

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
        API URL:{' '}
        <Link href={apiUrl} target='_blank' rel='noreferrer'>
          {apiUrl}
        </Link>
      </Typography>

      <Typography variant='p' sx={{ my: 1 }} display='block'>
        Development Mode: {devMode ? 'Yes' : 'No'}
      </Typography>
    </GridItemContainer>
  );
};

export default FrontendStatus;
