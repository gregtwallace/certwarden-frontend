import { type FC } from 'react';

import Alert from '@mui/material/Alert';

// prop types
type propTypes = {
  statusCode: number | string | undefined;
  message: string | undefined;
};

// component
const ApiError: FC<propTypes> = (props) => {
  const { statusCode, message } = props;

  return (
    <Alert sx={{ m: 2 }} severity='error'>
      An API error has occurred.
      <br />
      Status Code: {statusCode}
      <br />
      Message: {message}
    </Alert>
  );
};

export default ApiError;
