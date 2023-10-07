import PropTypes from 'prop-types';

import { Box, Typography } from '@mui/material';

import GridItemContainer from '../../../UI/Grid/GridItemContainer';
import FormRowRight from '../../../UI/FormMui/FormRowRight';
import Button from '../../../UI/Button/Button';

import ProviderTitle from './Common/ProviderTitle';
import ProviderDomainsView from './Common/ProviderDomainsView';
import ConfigView from './Common/ConfigView';

const sxContainer = {
  display: 'flex',
  flexDirection: 'column',
};

const ViewOneProvider = (props) => {
  return (
    <GridItemContainer sx={sxContainer}>
      <ProviderTitle provider={props.provider} />
      <ProviderDomainsView domains={props.provider.config.domains} />

      <Typography level='body-xs' fontWeight='lg'>
        Config
      </Typography>

      <ConfigView config={props.provider.config} />

      <Box
        sx={{
          minHeight: 0,
          flexGrow: 1,
        }}
      ></Box>

      <FormRowRight>
        <Button
          href={`/providers/${props.provider.id}`}
          type='edit'
        >
          Edit
        </Button>
      </FormRowRight>

    </GridItemContainer>
  );
};

ViewOneProvider.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tag: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
  }).isRequired,
};

export default ViewOneProvider;
