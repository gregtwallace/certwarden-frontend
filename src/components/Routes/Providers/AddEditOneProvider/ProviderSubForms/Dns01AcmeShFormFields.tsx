import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../types/frontend';

import { Link } from '@mui/material';

import SubFormError from './SubFormError';
import FormInfo from '../../../../UI/FormMui/FormInfo';
import InputArrayText from '../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01AcmeShFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'acme_sh_path' in formState.dataToSubmit.config &&
      'dns_hook' in formState.dataToSubmit.config &&
      'environment' in formState.dataToSubmit.config ? (
        <>
          <FormInfo>
            Paths where acme.sh is unpacked (including dnsapi folder). May be
            relative to LeGo or absolute.
          </FormInfo>

          <InputTextField
            id='dataToSubmit.config.acme_sh_path'
            label='Path to acme.sh Install'
            value={formState.dataToSubmit.config.acme_sh_path}
            onChange={onChange}
            error={
              formState.validationErrors['dataToSubmit.config.acme_sh_path']
            }
          />

          <FormInfo>
            For hook name and environment variables, look up your DNS provider
            at{' '}
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
            cert&quot; command for your provider. For example, Cloudflare is
            dns_cf.
          </FormInfo>

          <InputTextField
            id='dataToSubmit.config.dns_hook'
            label='DNS Hook Name'
            value={formState.dataToSubmit.config.dns_hook}
            onChange={onChange}
            error={formState.validationErrors['dataToSubmit.config.dns_hook']}
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
            id='dataToSubmit.config.environment'
            label='Environment Variables'
            subLabel='Variable'
            value={formState.dataToSubmit.config.environment}
            onChange={onChange}
          />
        </>
      ) : (
        <SubFormError providerType='Dns01AcmeSh' />
      )}
    </>
  );
};

export default Dns01AcmeShFormFields;
