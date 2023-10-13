import { PropTypes } from 'prop-types';

import FormInfo from '../../../../UI/FormMui/FormInfo';
import InputArrayObjectsOfText from '../../../../UI/FormMui/InputArrayObjectsOfText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01AcmeDnsFormFields = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      <FormInfo>
        Server address including protocol and port (e.g.
        https://myacmedns.example.com:8880)
      </FormInfo>

      <InputTextField
        id='form.acme_dns_address'
        label='ACME DNS Server Address'
        value={formState.form.acme_dns_address}
        onChange={onChange}
        error={formState.validationErrors.acme_dns_address}
      />

      <FormInfo>
        You must manually create each resource in acme-dns and then populate the
        information about each here.
      </FormInfo>

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
