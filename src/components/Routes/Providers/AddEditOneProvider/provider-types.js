import { isEmailValid, isPortValid } from '../../../../helpers/form-validation';

import DummyFormFields from './ProviderForms/DummyFormFields';
import Dns01CloudflareFormFields from './ProviderForms/Dns01CloudflareFormFields';
import Http01InternalFormFields from './ProviderForms/Http01InternalFormFields';

// dummy provider holds a dummy component to prevent errors if something goes wrong
const dummyProvider = {
  // value to use in the input field
  value: '',

  // friendly name
  name: 'Dummy Provider',

  // component to render provider specific fields
  FormComponent: DummyFormFields,

  // name of config to use when sending POST to backend
  configName: 'dummy_config',

  // fields to also set when this provider type is selected
  // alsoSet: [{}]

  // function to set provider_options when editing the provider
  // setProviderOptionsForEdit: () => {},

  // function to return validation object prior to POST
  validationFunc: () => {
    return {};
  },
};

// providerTypes lists all of the provider type options and related details
// to be used in add or edit operations
export const providerTypes = [
  {
    value: 'dns01cloudflare',
    name: 'DNS-01 Cloudflare',
    FormComponent: Dns01CloudflareFormFields,
    configName: 'dns_01_cloudflare',
    alsoSet: [
      {
        name: 'form',
        value: {
          domains: [''],
        },
      },
      {
        name: 'provider_options',
        value: {
          api_access_method: '',
        },
      },
    ],
    setProviderOptionsForEdit: (config) => {
      let api_access_method = 0;
      if (config?.account) {
        api_access_method = 1;
      }
      return {
        api_access_method: api_access_method,
      };
    },
    validationFunc: (formState) => {
      let validationErrors = {};

      // must select api_access_method
      if (formState.provider_options.api_access_method === '') {
        validationErrors.api_access_method = true;
      }

      // if using api_token, make sure not blank
      if (
        formState.form.api_token != undefined &&
        formState.form.api_token === ''
      ) {
        validationErrors.api_token = true;
      }

      // if using account, make sure email valid and global key not blank
      if (
        formState.form.account != undefined &&
        !isEmailValid(formState.form.account.email)
      ) {
        validationErrors.email = true;
      }
      if (
        formState.form.account != undefined &&
        formState.form.account.global_api_key === ''
      ) {
        validationErrors.global_api_key = true;
      }

      return validationErrors;
    },
  },
  {
    value: 'http01internal',
    name: 'HTTP-01 Internal Server',
    FormComponent: Http01InternalFormFields,
    configName: 'http_01_internal',
    alsoSet: [
      {
        name: 'form',
        value: {
          domains: [''],
          port: '',
        },
      },
      {
        name: 'provider_options',
        value: undefined,
      },
    ],
    validationFunc: (formState) => {
      let validationErrors = {};

      // must set a valid port number
      if (!isPortValid(formState.form.port)) {
        validationErrors.port = true;
      }

      return validationErrors;
    },
  },
];

// getProvider returns a provider object based on the specified value
export const getProvider = (providerValue) => {
  const foundProvider = providerTypes.find((provider) => {
    return providerValue === provider.value;
  });

  // if not found (somehow)
  if (foundProvider == undefined) {
    return dummyProvider;
  }

  return foundProvider;
};
