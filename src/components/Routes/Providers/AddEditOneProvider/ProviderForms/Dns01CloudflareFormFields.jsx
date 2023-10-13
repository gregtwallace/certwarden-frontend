import { PropTypes } from 'prop-types';

import InputSelect from '../../../../UI/FormMui/InputSelect';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const apiAccessTypes = [
  {
    value: 0,
    name: 'API Token',
    alsoSet: [
      {
        name: 'form.api_token',
        value: '',
      },
      {
        name: 'form.account',
        value: undefined,
      },
    ],
  },
  {
    value: 1,
    name: 'Global API Key',
    alsoSet: [
      {
        name: 'form.api_token',
        value: undefined,
      },
      {
        name: 'form.account',
        value: {
          email: '',
          global_api_key: '',
        },
      },
    ],
  },
];

const Dns01CloudflareFormFields = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      <InputSelect
        id='provider_options.api_access_method'
        label='API Access Method'
        options={apiAccessTypes}
        value={formState.provider_options.api_access_method}
        onChange={onChange}
        error={formState.validationErrors.api_access_method}
      />

      {formState.provider_options.api_access_method === 0 && (
        <InputTextField
          id='form.api_token'
          label='Cloudflare API Token'
          value={formState.form.api_token}
          onChange={onChange}
          error={formState.validationErrors.api_token}
        />
      )}

      {formState.provider_options.api_access_method === 1 && (
        <>
          <InputTextField
            id='form.account.email'
            label='Account Email'
            value={formState.form.account.email}
            onChange={onChange}
            error={formState.validationErrors.email}
          />

          <InputTextField
            id='form.account.global_api_key'
            label='Account Global API Key'
            value={formState.form.account.global_api_key}
            onChange={onChange}
            error={formState.validationErrors.global_api_key}
          />
        </>
      )}
    </>
  );
};

Dns01CloudflareFormFields.propTypes = {
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dns01CloudflareFormFields;
