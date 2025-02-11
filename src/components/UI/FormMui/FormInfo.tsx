import { type FC, type ReactNode } from 'react';
import { type TypographyProps } from '@mui/material';
import { type SystemStyleObject } from '@mui/system';

import HelpIcon from '@mui/icons-material/Help';
import { Typography } from '@mui/material';

import IconButtonAsLink from '../../UI/Button/IconButtonAsLink';

type propTypes = {
  children: ReactNode;
  color?: TypographyProps['color'];
  sx?: SystemStyleObject;
  helpURL?: string;
};

const FormInfo: FC<propTypes> = (props) => {
  const { children, color, helpURL, sx } = props;

  return (
    <Typography
      color={color || 'primary'}
      variant='body2'
      sx={sx || { mx: 2, my: 1 }}
    >
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
