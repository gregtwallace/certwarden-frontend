import { type FC } from 'react';

import Alert from '@mui/material/Alert';

// prop types
type propTypes = {
  providerType: string;
};

// component
const SubFormError: FC<propTypes> = (props) => {
  const { providerType } = props;

  return (
    <Alert sx={{ m: 1 }} severity='error'>
      Provider subform failed to load. Report this bug if this error persists.
      <br />
      Attempting to Load Provider Type: {providerType}
    </Alert>
  );
};

export default SubFormError;
