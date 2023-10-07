import PropTypes from 'prop-types';

import { List, ListItem, ListItemText, Typography } from '@mui/material';

const ProviderDomainsView = (props) => {
  return (
    <>
      <Typography level='body-xs' fontWeight='lg'>
        Domains
      </Typography>
      <List dense={true}>
        {props.domains.map((domain) => (
          <ListItem key={domain}>
            <ListItemText primary={domain} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

ProviderDomainsView.propTypes = {
  domains: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProviderDomainsView;
