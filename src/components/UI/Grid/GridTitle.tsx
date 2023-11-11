import { type ElementType, type FC } from 'react';

import { Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';

type propTypes = {
  title: string;
  headerComponent?: ElementType;
};

const GridTitle: FC<propTypes> = (props) => {
  const { headerComponent, title } = props;

  return (
    <Toolbar variant='dense' disableGutters sx={{ m: 0, px: 1 }}>
      <Typography
        component={headerComponent || 'h3'}
        variant='subtitle2'
        color='primary'
        sx={{ flexGrow: 1 }}
        gutterBottom
      >
        {title}
      </Typography>
    </Toolbar>
  );
};

export default GridTitle;
