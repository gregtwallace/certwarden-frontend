import { type FC } from 'react';

import { Tooltip } from '@mui/material';

import { unixTimeToStandardizedString } from '../../../helpers/time';

// prop types
type propTypes = {
  unixTime: number | null;
};

const DateWithTooltip: FC<propTypes> = (props) => {
  const { unixTime } = props;

  // if null time, this component isn't rendered
  if (!unixTime) {
    return <></>;
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
