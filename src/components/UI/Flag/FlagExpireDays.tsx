import { type FC } from 'react';
import { type orderType } from '../../../types/api';

import { useTheme } from '@mui/material';

import { Box, Tooltip, Typography } from '@mui/material';
import { daysUntil, secsUntil } from '../../../helpers/time';

// NOTE: Does NOT use common Flag component, since the styling is significantly
// different than other flags.

// prop types
type propTypes = {
  order: orderType;
};

// component
const FlagExpireDays: FC<propTypes> = (props) => {
  const { order } = props;
  const theme = useTheme();

  const { valid_to: validTo, valid_from: validFrom, renewal_info: ari } = order;

  // if component receives bad values, render an error instead
  if (validTo === null || validFrom === null || ari === null) {
    console.log(
      'error: expiration flag received null value(s), report this problem'
    );
    return <>Error!</>;
  }

  // colors:
  //    > 1 week until renewal window begins : primary
  //    < 1 week until renewal window begins, but it hasn't begun : secondary
  //    in the renewal window : warning
  //    past the end of the renewal window : error
  let bgcolorHex = theme.palette.primary.main;

  const now = new Date();
  const nowPlus7 = new Date(Date.now() + 3600 * 1000 * 24 * 7);
  if (ari.suggestedWindow.end < now) {
    bgcolorHex = theme.palette.error.main;
  } else if (ari.suggestedWindow.start < now) {
    bgcolorHex = theme.palette.warning.main;
  } else if (ari.suggestedWindow.start <= nowPlus7) {
    bgcolorHex = theme.palette.secondary.main;
  }

  // for display text
  const totalDurationSecs = validTo - validFrom;
  const daysRemainingValid = daysUntil(validTo);

  // for tooltip text & bar fill
  const percentValidRemaining = Math.floor(
    (secsUntil(validTo) / totalDurationSecs) * 100
  );

  // linear gradient background string
  const backgroundGradient =
    'linear-gradient(to right, ' +
    bgcolorHex +
    ' ' +
    percentValidRemaining.toString() +
    '%, transparent 0%)';

  return (
    <Tooltip
      title={
        <>
          Validity Remaining:
          <br />
          {daysRemainingValid.toString() + ' Days ('}
          {percentValidRemaining.toString() + '%)'}
          <br />
          <br />
          Renewal Window:
          <br />
          {ari.suggestedWindow.start.toLocaleString()} to
          <br />
          {ari.suggestedWindow.end.toLocaleString()}
          <br />
          {ari.retryAfter && (
            <>
              <br />
              Next ARI Refresh After:
              <br />
              {ari.retryAfter.toLocaleString()}
            </>
          )}
        </>
      }
      placement='left'
    >
      <Box
        component='span'
        sx={{
          mx: 0.5,
          paddingX: '17px',
          paddingY: '3px',
          borderRadius: '5px',
          background: backgroundGradient,
          border: 1,
          borderColor: 'text.main',
        }}
      >
        <Typography
          component='span'
          variant='caption'
          fontSize={11}
          noWrap
          paddingX='3px'
          sx={{
            borderRadius: '3px',
            backgroundColor: theme.palette.background.default,
          }}
        >
          {daysRemainingValid.toString() + ' Days'}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default FlagExpireDays;
