import { type FC } from 'react';

import { Tooltip } from '@mui/material';

import { unixTimeToString } from '../../../helpers/time';

const dateWithTimeFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
};

// prop types
type propTypes = {
  unixTime: number | null;
};

const DateWithTooltip: FC<propTypes> = (props) => {
  const { unixTime } = props;

  return (
    <Tooltip
      title={
        unixTime !== null &&
        unixTime > 0 &&
        unixTimeToString(unixTime, dateWithTimeFormat)
      }
      placement='right'
    >
      <span>{unixTimeToString(unixTime)}</span>
    </Tooltip>
  );
};

export default DateWithTooltip;
