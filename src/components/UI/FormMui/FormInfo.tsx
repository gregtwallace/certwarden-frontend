import { type FC, type ReactNode } from 'react';
import { type SystemStyleObject } from '@mui/system';

import HelpIcon from '@mui/icons-material/Help';
import { Typography } from '@mui/material';

import IconButtonAsLink from '../../UI/Button/IconButtonAsLink';

type propTypes = {
  children: ReactNode;
  sx?: SystemStyleObject;
  helpURL?: string;
};

const FormInfo: FC<propTypes> = (props) => {
  const { children, helpURL, sx } = props;

  return (
    <Typography variant='body2' sx={{ mx: 2, my: 1, ...sx }}>
      {children}

      {helpURL != undefined && (
        <IconButtonAsLink
          color='inherit'
          tooltip='Help'
          to={helpURL}
          target='_blank'
        >
          <HelpIcon style={{ fontSize: '17px' }} />
        </IconButtonAsLink>
      )}
    </Typography>
  );
};

export default FormInfo;
