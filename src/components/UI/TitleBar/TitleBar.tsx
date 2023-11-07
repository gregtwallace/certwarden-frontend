import { type ElementType, type FC, type ReactNode } from 'react';

import { Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';

type propTypes = {
  children?: ReactNode;

  title: string;
  headerComponent?: ElementType;
};

const TitleBar: FC<propTypes> = (props) => {
  const { children, headerComponent, title } = props;

  return (
    <Toolbar variant='dense' disableGutters sx={{ m: 0, px: 2 }}>
      <Typography
        component={headerComponent || 'h2'}
        variant='h6'
        color='primary'
        sx={{ flexGrow: 1 }}
        gutterBottom
      >
        {title}
      </Typography>
      {children}
    </Toolbar>
  );
};

export default TitleBar;
