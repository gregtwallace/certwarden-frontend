import { type ElementType, type FC, type ReactNode } from 'react';

import HelpIcon from '@mui/icons-material/Help';
import { Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';

import IconButtonAsLink from '../../UI/Button/IconButtonAsLink';

type propTypes = {
  children?: ReactNode;

  title: string;
  headerComponent?: ElementType;

  helpURL?: string;
};

const TitleBar: FC<propTypes> = (props) => {
  const { children, headerComponent, helpURL, title } = props;

  return (
    <Toolbar variant='dense' disableGutters sx={{ m: 0, px: 2 }}>
      <Typography
        component={headerComponent ?? 'h2'}
        variant='h6'
        color='primary'
        sx={{ flexGrow: 1 }}
      >
        {title}

        {helpURL != undefined && (
          <IconButtonAsLink
            color='primary'
            tooltip='Help'
            to={helpURL}
            target='_blank'
            rel='noreferrer'
          >
            <HelpIcon style={{ fontSize: '17px' }} />
          </IconButtonAsLink>
        )}
      </Typography>

      {children}
    </Toolbar>
  );
};

export default TitleBar;
