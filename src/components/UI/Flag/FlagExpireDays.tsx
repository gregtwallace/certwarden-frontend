import { type FC } from 'react';

import { Tooltip } from '@mui/material';

import { convertUnixTime, daysUntil } from '../../../helpers/time';

import Flag from './Flag';

// consts that determine when certs will be considered expiring and thus eligible
// for auto renewal
// KEEP IN SYNC with backend `orders/auto_ordering.go` consts
const expiringRemainingValidFraction = 0.333;
const expiringMinRemaining = 10 * (60 * 60 * 24); // x * seconds/day

// prop types
type propTypes = {
  validFrom: number;
  validTo: number;
};

// component
const FlagExpireDays: FC<propTypes> = (props) => {
  const { validFrom, validTo } = props;

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
  let color = 'white';
  let bgcolor = 'info.dark';

  // renewal imminent or overdue, set error color
  if (daysUntilThreshold <= 0) {
    color = 'white';
    bgcolor = 'error.dark';
  } else if (daysUntilThreshold <= 7) {
    // renewal within the next week, set warning color
    color = 'white';
    bgcolor = 'warning.dark';
  }

  // for Flag display text
  const daysRemainingValid = daysUntil(validTo);

  // for tooltip text
  const validityRemainRatio =
    daysRemainingValid / (totalDuration / (60 * 60 * 24));

  return (
    <Tooltip
      title={
        <>
          Validity Remaining:
          <br />
          {Math.round(validityRemainRatio * 100)}%
          <br />
          Renews After:
          <br />
          {convertUnixTime(remainingValidThresholdDate)}
        </>
      }
      placement='left'
    >
      <Flag
        text={daysRemainingValid.toString() + ' Days'}
        color={color}
        bgcolor={bgcolor}
      />
    </Tooltip>
  );
};

export default FlagExpireDays;
