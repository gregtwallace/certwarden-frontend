import { type FC } from 'react';

import { Tooltip } from '@mui/material';

import { unixTimeToStandardizedString } from '../../../helpers/time';

// prop types
type propTypes = {
  unixTime: number | null;
  altMessage?: string;
};

const DateWithTooltip: FC<propTypes> = (props) => {
  const { altMessage, unixTime } = props;

  // if null time, render nothing or the specified alternate message (e.g., 'Never')
  if (!unixTime) {
    return <>{altMessage}</>;
  }

  // convert time to text and render
  const fullDateString = unixTimeToStandardizedString(unixTime, 'both');
  const justDateString = unixTimeToStandardizedString(unixTime, 'dateOnly');

  return (
    <Tooltip title={fullDateString} placement='right'>
      <span>{justDateString}</span>
    </Tooltip>
  );
};

export default DateWithTooltip;
