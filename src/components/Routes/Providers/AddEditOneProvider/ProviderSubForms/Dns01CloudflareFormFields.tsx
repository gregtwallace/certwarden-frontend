import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../types/frontend';
import { type selectInputOption } from '../../../../../helpers/input-handler';

import SubFormError from './SubFormError';
import InputSelect from '../../../../UI/FormMui/InputSelect';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const apiAccessTypes: selectInputOption<number>[] = [
  {
    value: 0,
    name: 'API Token',
    alsoSet: [
      {
        name: 'dataToSubmit.api_token',
        value: '',
      },
      {
        name: 'dataToSubmit.account',
        value: undefined,
      },
    ],
  },
  {
    value: 1,
    name: 'Global API Key',
    alsoSet: [
      {
        name: 'dataToSubmit.api_token',
        value: undefined,
      },
      {
        name: 'dataToSubmit.account',
        value: {
          email: '',
          global_api_key: '',
        },
      },
    ],
  },
];

const Dns01CloudflareFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'provider_options' in formState &&
      formState.provider_options &&
      'api_access_method' in formState.provider_options &&
      (typeof formState.provider_options['api_access_method'] === 'number' ||
        formState.provider_options['api_access_method'] === '') ? (
        <>
          <InputSelect
            id='provider_options.api_access_method'
            label='API Access Method'
            options={apiAccessTypes}
            value={formState.provider_options['api_access_method']}
            onChange={onChange}
            error={
              formState.validationErrors['provider_options.api_access_method']
            }
          />

          {formState.provider_options['api_access_method'] === 0 &&
            'api_token' in formState.dataToSubmit && (
              <InputTextField
                id='dataToSubmit.api_token'
                label='Cloudflare API Token'
                value={formState.dataToSubmit.api_token}
                onChange={onChange}
                error={formState.validationErrors['dataToSubmit.api_token']}
              />
            )}

          {formState.provider_options['api_access_method'] === 1 &&
            'account' in formState.dataToSubmit && (
              <>
                <InputTextField
                  id='dataToSubmit.account.email'
                  label='Account Email'
                  value={formState.dataToSubmit.account.email}
                  onChange={onChange}
                  error={
                    formState.validationErrors['dataToSubmit.account.email']
                  }
                />

                <InputTextField
                  id='dataToSubmit.account.global_api_key'
                  label='Account Global API Key'
                  value={formState.dataToSubmit.account.global_api_key}
                  onChange={onChange}
                  error={
                    formState.validationErrors[
                      'dataToSubmit.account.global_api_key'
                    ]
                  }
                />
              </>
            )}
        </>
      ) : (
        <SubFormError providerType='Dns01Cloudflare' />
      )}
    </>
  );
};

export default Dns01CloudflareFormFields;
