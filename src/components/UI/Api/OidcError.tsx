import { type FC } from 'react';

import Alert from '@mui/material/Alert';

// prop types
type propTypes = {
  message: string | undefined;
};

// component
const OidcError: FC<propTypes> = (props) => {
  const { message } = props;

  return (
    <Alert sx={{ m: 1 }} severity='error'>
      An OIDC error has occurred.
      <br />
      Message: {message}
    </Alert>
  );
};

export default OidcError;
