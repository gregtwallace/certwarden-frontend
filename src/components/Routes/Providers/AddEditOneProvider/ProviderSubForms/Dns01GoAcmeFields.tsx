import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../types/frontend';

import { Link } from '@mui/material';

import SubFormError from './SubFormError';
import FormInfo from '../../../../UI/FormMui/FormInfo';
import InputArrayText from '../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01GoAcmeFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'dns_provider_name' in formState.dataToSubmit.config &&
      'environment' in formState.dataToSubmit.config ? (
        <>
          <FormInfo>
            For CLI flag name (Code) and environment variables, look up your DNS
            provider at{' '}
            <Link
              href='https://go-acme.github.io/lego/dns/'
              target='_blank'
              rel='noreferrer'
            >
              https://go-acme.github.io/lego/dns/
            </Link>
            .
          </FormInfo>

          <InputTextField
            id='dataToSubmit.config.dns_provider_name'
            label='Provider&apos;s "CLI flag name" or "Code"'
            value={formState.dataToSubmit.config.dns_provider_name}
            onChange={onChange}
            error={
              formState.validationErrors[
                'dataToSubmit.config.dns_provider_name'
              ]
            }
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
        <SubFormError providerType='Dns01GoAcme' />
      )}
    </>
  );
};

export default Dns01GoAcmeFields;
