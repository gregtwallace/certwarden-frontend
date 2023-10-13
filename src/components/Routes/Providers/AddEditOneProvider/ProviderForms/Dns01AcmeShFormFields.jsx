import { PropTypes } from 'prop-types';

import { Link, Typography } from '@mui/material';
import InputArrayText from '../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01AcmeShFormFields = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      <Typography variant='body2' sx={{ m: 2 }}>
        Paths where acme.sh is unpacked (including dnsapi folder). May be
        relative to LeGo or absolute.
      </Typography>

      <InputTextField
        id='form.acme_sh_path'
        label='Path to acme.sh Install'
        value={formState.form.acme_sh_path}
        onChange={onChange}
        error={formState.validationErrors.acme_sh_path}
      />

      <Typography variant='body2' sx={{ m: 2 }}>
        For hook name and environment variables, look up your DNS provider at{' '}
        <Link
          href='https://github.com/acmesh-official/acme.sh/wiki/dnsapi'
          target='_blank'
          rel='noreferrer'
        >
          https://github.com/acmesh-official/acme.sh/wiki/dnsapi
        </Link>
      </Typography>

      <Typography variant='body2' sx={{ m: 2 }}>
        Hook name is the value following the --dns flag in the &quot;issue a
        cert&quot; command for your provider. For example, Cloudflare is dns_cf.
      </Typography>

      <InputTextField
        id='form.dns_hook'
        label='DNS Hook Name'
        value={formState.form.dns_hook}
        onChange={onChange}
        error={formState.validationErrors.dns_hook}
      />

      <Typography variant='body2' sx={{ m: 2 }}>
        Format must be:
        <br />
        variable_name=variable_value
        <br />
        <br />
        For example: <br />
        my_api_key=abcdef12345
      </Typography>

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
