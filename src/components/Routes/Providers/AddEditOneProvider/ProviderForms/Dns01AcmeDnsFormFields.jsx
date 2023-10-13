import { PropTypes } from 'prop-types';

import { Typography } from '@mui/material';
import InputArrayObjectsOfText from '../../../../UI/FormMui/InputArrayObjectsOfText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01AcmeDnsFormFields = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      <Typography variant='body2' sx={{ m: 2 }}>
        Server address including protocol and port (e.g.
        https://myacmedns.example.com:8880)
      </Typography>

      <InputTextField
        id='form.acme_dns_address'
        label='ACME DNS Server Address'
        value={formState.form.acme_dns_address}
        onChange={onChange}
        error={formState.validationErrors.acme_dns_address}
      />

      <Typography variant='body2' sx={{ m: 2 }}>
        You must manually create each resource in acme-dns and then populate the
        information about each here.
      </Typography>

      <InputArrayObjectsOfText
        id='form.resources'
        label='ACME DNS Resources'
        subLabel='ACME DNS Resource'
        minElements={1}
        newObject={{
          real_domain: '',
          full_domain: '',
          username: '',
          password: '',
        }}
        value={formState.form.resources}
        onChange={onChange}
        error={formState.validationErrors.resources}
      />
    </>
  );
};

Dns01AcmeDnsFormFields.propTypes = {
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dns01AcmeDnsFormFields;
