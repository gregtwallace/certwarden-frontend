import { type FC } from 'react';

import { useTheme } from '@mui/material';

import { Box, Tooltip, Typography } from '@mui/material';
import { convertUnixTime, daysUntil } from '../../../helpers/time';

// consts that determine when certs will be considered expiring and thus eligible
// for auto renewal
// KEEP IN SYNC with backend `orders/auto_ordering.go` consts
const expiringRemainingValidFraction = 0.333;
const expiringMinRemaining = 10 * (60 * 60 * 24); // x * seconds/day

// NOTE: Does NOT use common Flag component, since the styling is significantly
// different than other flags.

// prop types
type propTypes = {
  validFrom: number;
  validTo: number;
};

// component
const FlagExpireDays: FC<propTypes> = (props) => {
  const { validFrom, validTo } = props;
  const theme = useTheme();

  // there are two renewal thresholds, calculate both
  // elapsed fraction of valid time
  const totalDuration = validTo - validFrom;

  const remainingValidFractionThresholdDate =
    validTo - totalDuration * expiringRemainingValidFraction;

  // remaining valid time
  const remainingValidMinThresholdDate = validTo - expiringMinRemaining;

  // whichever threshold is sooner is when renewal will occur
  const remainingValidThresholdDate = Math.min(
    remainingValidFractionThresholdDate,
    remainingValidMinThresholdDate
  );
  const daysUntilThreshold = daysUntil(remainingValidThresholdDate);

  // default color
  let bgcolorHex = theme.palette['info']['main'];

  // renewal imminent or overdue, set error color
  if (daysUntilThreshold <= 0) {
    bgcolorHex = theme.palette['error']['main'];
  } else if (daysUntilThreshold <= 7) {
    // renewal within the next week, set warning color
    bgcolorHex = theme.palette['warning']['main'];
  }

  // for Flag display text
  const daysRemainingValid = daysUntil(validTo);

  // for tooltip text & bar fill
  const bgFillPercent = Math.floor(
    (daysRemainingValid / (totalDuration / (60 * 60 * 24))) * 100
  );

  // linear gradient background string
  const backgroundGradient =
    'linear-gradient(to right, ' +
    bgcolorHex +
    ' ' +
    bgFillPercent +
    '%, transparent 0%)';

  return (
    <Tooltip
      title={
        <>
          Validity Remaining:
          <br />
          {daysRemainingValid.toString() + ' Days ('}
          {bgFillPercent + '%)'}
          <br />
          Renews After:
          <br />
          {convertUnixTime(remainingValidThresholdDate)}
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
