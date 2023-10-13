import { PropTypes } from 'prop-types';

import { Link } from '@mui/material';
import FormInfo from '../../../../UI/FormMui/FormInfo';
import InputArrayText from '../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01AcmeShFormFields = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      <FormInfo>
        Paths where acme.sh is unpacked (including dnsapi folder). May be
        relative to LeGo or absolute.
      </FormInfo>

      <InputTextField
        id='form.acme_sh_path'
        label='Path to acme.sh Install'
        value={formState.form.acme_sh_path}
        onChange={onChange}
        error={formState.validationErrors.acme_sh_path}
      />

      <FormInfo>
        For hook name and environment variables, look up your DNS provider at{' '}
        <Link
          href='https://github.com/acmesh-official/acme.sh/wiki/dnsapi'
          target='_blank'
          rel='noreferrer'
        >
          https://github.com/acmesh-official/acme.sh/wiki/dnsapi
        </Link>
      </FormInfo>

      <FormInfo>
        Hook name is the value following the --dns flag in the &quot;issue a
        cert&quot; command for your provider. For example, Cloudflare is dns_cf.
      </FormInfo>

      <InputTextField
        id='form.dns_hook'
        label='DNS Hook Name'
        value={formState.form.dns_hook}
        onChange={onChange}
        error={formState.validationErrors.dns_hook}
      />

      <FormInfo>
        Format must be:
        <br />
        variable_name=variable_value
        <br />
        <br />
        For example: <br />
        my_api_key=abcdef12345
      </FormInfo>

      <InputArrayText
        id='form.environment'
        label='Environment Variables'
        subLabel='Variable'
        value={formState.form.environment}
        onChange={onChange}
      />
    </>
  );
};

Dns01AcmeShFormFields.propTypes = {
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dns01AcmeShFormFields;
