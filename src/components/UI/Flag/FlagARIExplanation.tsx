import { type FC } from 'react';

import { useTheme } from '@mui/material';
import { Link, Tooltip, Typography } from '@mui/material';

// prop types
type propTypes = {
  explanationURL: string;
};

// component
const FlagARIExplanation: FC<propTypes> = (props) => {
  const { explanationURL } = props;
  const theme = useTheme();

  return (
    <Link
      href={explanationURL}
      target='_blank'
      rel='noreferrer'
      color='#ffffff'
    >
      <Tooltip
        title={
          <>
            The ACME server for this certificate sent renewal information
            containing an `explanationURL`.
            <br />
            <br />
            This may indicate an anomoly such as a security event. You
            should review the information found at the URL and take any
            action(s) you deem necessary.
            <br />
            <br />
            <Link
              href={explanationURL}
              target='_blank'
              rel='noreferrer'
              color='#ffffff'
            >
              {explanationURL}
            </Link>
          </>
        }
        placement='left'
      >
        <Typography
          component='span'
          variant='caption'
          noWrap
          sx={{
            mx: 0.5,
            paddingX: '10px',
            paddingY: '5px',
            borderRadius: '7px',
            color: 'white',
            bgcolor: theme.palette.error.main,
          }}
        >
          ARI Explanation
        </Typography>
      </Tooltip>
    </Link>
  );
};

export default FlagARIExplanation;
