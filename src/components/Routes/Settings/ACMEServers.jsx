// This file is just a link to AllACMEServers, rather than putting it in the sidebar.
// Doing this instead of sidebar since this is advanced and support is primarily
// given to Let's Encrypt compatibility.

import { useNavigate } from 'react-router';
import { Typography } from '@mui/material';

import Button from '../../UI/Button/Button';
import FormFooter from '../../UI/FormMui/FormFooter';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridTitle from '../../UI/Grid/GridTitle';

const ACMEServers = () => {
  // navigate to ACME Servers on click
  const navigate = useNavigate();
  const viewServersClickHandler = (event) => {
    event.preventDefault();

    navigate('/acmeservers');
  };

  return (
    <GridItemContainer>
      <GridTitle title='ACME Servers' />

      <Typography variant='p' sx={{ my: 1 }} display='block'>
        You can view and modify ACME Servers by following this link.
      </Typography>

      <Typography variant='p' sx={{ my: 1 }} display='block'>
        Support is primarily provided for Let&apos;s Encrypt compatibility, but
        if you have issues with other ACME Server providers feel free to open an
        issue.
      </Typography>

      <FormFooter>
        <Button
          onClick={viewServersClickHandler}
          variant='contained'
          type='primary'
        >
          View Servers
        </Button>
      </FormFooter>
    </GridItemContainer>
  );
};

export default ACMEServers;
