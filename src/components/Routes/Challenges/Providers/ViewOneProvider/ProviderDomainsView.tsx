import { type FC } from 'react';

import { List, ListItem, ListItemText } from '@mui/material';

import GridItemText from '../../../../UI/Grid/GridItemText';

type propTypes = {
  domains: string[];
};

const ProviderDomainsView: FC<propTypes> = (props) => {
  return (
    <>
      <GridItemText>Domains</GridItemText>

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

export default ProviderDomainsView;
