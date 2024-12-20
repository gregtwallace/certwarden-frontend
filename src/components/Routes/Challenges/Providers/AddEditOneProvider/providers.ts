import { type FC } from 'react';
import { type alsoSetType } from '../../../../../helpers/input-handler';
import {
  type providerConfigType,
  type providerFormStateType,
  type providerSubFormPropsType,
  type validationErrorsType,
} from '../../../../../types/frontend';

import {
  isDomainValid,
  isEmailValid,
  isEnvironmentParamValid,
  isHttpsUrlValid,
  isPortValid,
} from '../../../../../helpers/form-validation';

import DummyFormFields from './ProviderSubForms/DummyFormFields';
import Http01InternalFormFields from './ProviderSubForms/Http01InternalFormFields';
import Dns01AcmeDnsFormFields from './ProviderSubForms/Dns01AcmeDnsFormFields';
import Dns01AcmeShFormFields from './ProviderSubForms/Dns01AcmeShFormFields';
import Dns01CloudflareFormFields from './ProviderSubForms/Dns01CloudflareFormFields';
import Dns01GoAcmeFields from './ProviderSubForms/Dns01GoAcmeFields';
import Dns01ManualFormFields from './ProviderSubForms/Dns01ManualFormFields';

type provider = {
  value: string;
  name: string;
  supportsWindows: boolean;
  FormComponent: FC<providerSubFormPropsType>;
  configName: string;
  alsoSet: alsoSetType[] | undefined;
  providerOptionsForEdit:
    | ((
        providerConfig: providerConfigType | undefined
      ) => Record<string, unknown> | undefined)
    | undefined;
  validationFunc: (formState: providerFormStateType) => validationErrorsType;
  helpUrl: string;
};

// dummy provider holds a dummy component to prevent errors if something goes wrong
const dummyProvider: provider = {
  // value to use in the input field
  value: '',

  // friendly name
  name: 'Dummy Provider',

  // provider supports windows OS
  supportsWindows: true,

  // component to render provider specific fields
  FormComponent: DummyFormFields,

  // name of config to use when sending POST to backend
  configName: 'dummy_config',

  // [OPTIONAL] fields to also set when this provider type is selected
  // alsoSet: [{}]
  alsoSet: undefined,

  // [OPTIONAL] function to set provider_options when editing the provider
  // setProviderOptionsForEdit: () => {},
  providerOptionsForEdit: undefined,

  // function to return validation object prior to POST
  validationFunc: () => {
    return {};
  },

  // link to help page
  helpUrl: 'https://www.certwarden.com/docs/user_interface/providers/',
};

// providerTypes lists all of the provider type options and related details
// to be used in add or edit operations
export const providersList: provider[] = [
  {
    value: 'dns01acmedns',
    name: 'DNS-01 acme-dns',
    supportsWindows: true,
    FormComponent: Dns01AcmeDnsFormFields,
    configName: 'dns_01_acme_dns',
    alsoSet: [
      {
        name: 'dataToSubmit.config',
        value: {
          acme_dns_address: '',
          resources: [
            {
              real_domain: '',
              full_domain: '',
              username: '',
              password: '',
            },
          ],
        },
      },
      {
        name: 'validationErrors',
        value: {},
      },
      {
        name: 'provider_options',
        value: undefined,
      },
    ],
    providerOptionsForEdit: undefined,
    validationFunc: (formState) => {
      const validationErrors: validationErrorsType = {};

      // must specify server address
      if (
        !('acme_dns_address' in formState.dataToSubmit.config) ||
        formState.dataToSubmit.config.acme_dns_address === '' ||
        !isHttpsUrlValid(formState.dataToSubmit.config.acme_dns_address)
      ) {
        validationErrors['dataToSubmit.config.acme_dns_address'] = true;
      }

      // each resource must have all fields populated
      if (!('resources' in formState.dataToSubmit.config)) {
        console.error(new Error('resources missing on dns01acmedns'));
        validationErrors['dataToSubmit.config.resources'] = true;
      } else {
        formState.dataToSubmit.config['resources'].forEach(
          (resc, rescIndex) => {
            // check each resource field
            let rescError = false;
            if (!isDomainValid(resc.real_domain)) {
              validationErrors[
                `dataToSubmit.config.resources.${rescIndex}.real_domain`
              ] = true;
              rescError = true;
            }
            if (!isDomainValid(resc.full_domain)) {
              validationErrors[
                `dataToSubmit.config.resources.${rescIndex}.full_domain`
              ] = true;
              rescError = true;
            }
            if (resc.username === '') {
              validationErrors[
                `dataToSubmit.config.resources.${rescIndex}.username`
              ] = true;
              rescError = true;
            }
            if (resc.password === '') {
              validationErrors[
                `dataToSubmit.config.resources.${rescIndex}.password`
              ] = true;
              rescError = true;
            }

            // set error on resource if any field failed
            if (rescError) {
              validationErrors[`dataToSubmit.config.resources.${rescIndex}`] =
                true;
            }
          }
        );
      }
      return validationErrors;
    },

    helpUrl:
      'https://www.certwarden.com/docs/user_interface/providers/dns01_acme_dns/',
  },

  {
    value: 'dns01acmesh',
    name: 'DNS-01 acme.sh',
    supportsWindows: false,
    FormComponent: Dns01AcmeShFormFields,
    configName: 'dns_01_acme_sh',
    alsoSet: [
      {
        name: 'dataToSubmit.config',
        value: {
          acme_sh_path: '',
          dns_hook: '',
          environment: [],
        },
      },
      {
        name: 'validationErrors',
        value: {},
      },
      {
        name: 'provider_options',
        value: undefined,
      },
    ],
    providerOptionsForEdit: undefined,
    validationFunc: (formState) => {
      const validationErrors: validationErrorsType = {};

      // must specify path
      if (
        !('acme_sh_path' in formState.dataToSubmit.config) ||
        formState.dataToSubmit.config.acme_sh_path === ''
      ) {
        validationErrors['dataToSubmit.config.acme_sh_path'] = true;
      }

      // must specify hook name
      if (
        !('dns_hook' in formState.dataToSubmit.config) ||
        formState.dataToSubmit.config.dns_hook === ''
      ) {
        validationErrors['dataToSubmit.config.dns_hook'] = true;
      }

      // check env vars (if exist)
      if ('environment' in formState.dataToSubmit.config) {
        formState.dataToSubmit.config.environment.forEach((param, index) => {
          // check each param
          if (!isEnvironmentParamValid(param)) {
            validationErrors[`dataToSubmit.config.environment.${index}`] = true;
          }
        });
      }

      return validationErrors;
    },

    helpUrl:
      'https://www.certwarden.com/docs/user_interface/providers/dns01_acme.sh/',
  },

  {
    value: 'dns01cloudflare',
    name: 'DNS-01 Cloudflare',
    supportsWindows: true,
    FormComponent: Dns01CloudflareFormFields,
    configName: 'dns_01_cloudflare',
    alsoSet: [
      {
        name: 'dataToSubmit.config',
        value: {},
      },
      {
        name: 'validationErrors',
        value: {},
      },
      {
        name: 'provider_options',
        value: {
          api_access_method: '',
        },
      },
    ],
    providerOptionsForEdit: (providerConfig) => {
      // in undefined, return undefined
      if (!providerConfig) {
        return undefined;
      }

      let api_access_method = 0;
      if ('account' in providerConfig) {
        api_access_method = 1;
      }
      return {
        api_access_method: api_access_method,
      };
    },
    validationFunc: (formState) => {
      const validationErrors: validationErrorsType = {};

      // must select api_access_method
      if (
        !('provider_options' in formState) ||
        !formState.provider_options ||
        !('api_access_method' in formState.provider_options) ||
        typeof formState.provider_options['api_access_method'] !== 'number'
      ) {
        validationErrors['provider_options.api_access_method'] = true;
      }

      // if using api_token, make sure not blank
      if (
        !('account' in formState.dataToSubmit.config) &&
        (!('api_token' in formState.dataToSubmit.config) ||
          formState.dataToSubmit.config.api_token === '')
      ) {
        validationErrors['dataToSubmit.config.api_token'] = true;
      }

      // if using account, make sure email valid and global key not blank
      if (
        'account' in formState.dataToSubmit.config &&
        !isEmailValid(formState.dataToSubmit.config.account.email)
      ) {
        validationErrors['dataToSubmit.config.account.email'] = true;
      }

      if (
        'account' in formState.dataToSubmit.config &&
        formState.dataToSubmit.config.account.global_api_key === ''
      ) {
        validationErrors['dataToSubmit.config.account.global_api_key'] = true;
      }

      return validationErrors;
    },

    helpUrl:
      'https://www.certwarden.com/docs/user_interface/providers/dns01_cloudflare/',
  },

  {
    value: 'dns01manual',
    name: 'DNS-01 Manual Script',
    supportsWindows: true,
    FormComponent: Dns01ManualFormFields,
    configName: 'dns_01_manual',
    alsoSet: [
      {
        name: 'dataToSubmit.config',
        value: {
          environment: [],
          create_script: '',
          delete_script: '',
        },
      },
      {
        name: 'validationErrors',
        value: {},
      },
      {
        name: 'provider_options',
        value: undefined,
      },
    ],
    providerOptionsForEdit: undefined,
    validationFunc: (formState) => {
      const validationErrors: validationErrorsType = {};

      // must set path to create and delete
      if (
        !('create_script' in formState.dataToSubmit.config) ||
        formState.dataToSubmit.config.create_script === ''
      ) {
        validationErrors['dataToSubmit.config.create_script'] = true;
      }
      if (
        !('delete_script' in formState.dataToSubmit.config) ||
        formState.dataToSubmit.config.delete_script === ''
      ) {
        validationErrors['dataToSubmit.config.delete_script'] = true;
      }

      // check env vars (if exist)
      if ('environment' in formState.dataToSubmit.config) {
        formState.dataToSubmit.config.environment.forEach((param, index) => {
          // check each param
          if (!isEnvironmentParamValid(param)) {
            validationErrors[`dataToSubmit.config.environment.${index}`] = true;
          }
        });
      }

      return validationErrors;
    },

    helpUrl:
      'https://www.certwarden.com/docs/user_interface/providers/dns01_manual_script/',
  },

  {
    value: 'dns01goacme',
    name: 'DNS-01 go-acme le-go',
    supportsWindows: true,
    FormComponent: Dns01GoAcmeFields,
    configName: 'dns_01_go_acme',
    alsoSet: [
      {
        name: 'dataToSubmit.config',
        value: {
          dns_provider_name: '',
          environment: [],
        },
      },
      {
        name: 'validationErrors',
        value: {},
      },
      {
        name: 'provider_options',
        value: undefined,
      },
    ],
    providerOptionsForEdit: undefined,
    validationFunc: (formState) => {
      const validationErrors: validationErrorsType = {};

      // must specify provider name
      if (
        !('dns_provider_name' in formState.dataToSubmit.config) ||
        formState.dataToSubmit.config.dns_provider_name === ''
      ) {
        validationErrors['dataToSubmit.config.dns_provider_name'] = true;
      }

      // check env vars (if exist)
      if ('environment' in formState.dataToSubmit.config) {
        formState.dataToSubmit.config.environment.forEach((param, index) => {
          // check each param
          if (!isEnvironmentParamValid(param)) {
            validationErrors[`dataToSubmit.config.environment.${index}`] = true;
          }
        });
      }

      return validationErrors;
    },

    helpUrl:
      'https://www.certwarden.com/docs/user_interface/providers/dns01_go_acme_le_go/',
  },

  {
    value: 'http01internal',
    name: 'HTTP-01 Internal Server',
    FormComponent: Http01InternalFormFields,
    supportsWindows: true,
    configName: 'http_01_internal',
    alsoSet: [
      {
        name: 'dataToSubmit.config',
        value: {
          port: '',
        },
      },
      {
        name: 'validationErrors',
        value: {},
      },
      {
        name: 'provider_options',
        value: undefined,
      },
    ],
    providerOptionsForEdit: undefined,
    validationFunc: (formState) => {
      const validationErrors: validationErrorsType = {};

      // must set a valid port number
      if (
        !('port' in formState.dataToSubmit.config) ||
        !isPortValid(formState.dataToSubmit.config.port)
      ) {
        validationErrors['dataToSubmit.config.port'] = true;
      }

      return validationErrors;
    },

    helpUrl:
      'https://www.certwarden.com/docs/user_interface/providers/http01_internal/',
  },
];

// getProvider returns a provider object based on the specified value
export const getProvider = (providerValue: string): provider => {
  const foundProvider = providersList.find((provider) => {
    return providerValue === provider.value;
  });

  // if not found (somehow)
  if (foundProvider == undefined) {
    return dummyProvider;
  }

  return foundProvider;
};
