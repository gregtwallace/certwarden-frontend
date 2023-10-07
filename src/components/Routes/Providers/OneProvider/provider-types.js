import {
  isDomainValid,
  isPortValid,
} from '../../../../helpers/form-validation';

import DummyFormFields from './ProviderForms/DummyFormFields';
import Http01InternalFormFields from './ProviderForms/Http01InternalFormFields';

// validation functions for providers (to keep providerTypes more readable)
const validateHttp01Internal = (form) => {
  let validationErrors = {};
  // domains
  var domains = [];
  form.domains.forEach((domain, i) => {
    if (!isDomainValid(domain)) {
      domains.push(i);
    }
  });
  // if any alts invalid, create the error array
  if (domains.length !== 0) {
    validationErrors.domains = domains;
  }

  // port number
  if (!isPortValid(form.port)) {
    validationErrors.port = true;
  }

  return validationErrors;
};

// providerTypes maps known types to their add and edit components
export const providerTypes = [
  {
    value: 'dns01cloudflare',
    name: 'DNS-01 Cloudflare',
    FormComponent: DummyFormFields,
    config_name: 'dns_01_cloudflare',
  },
  {
    value: 'http01internal',
    name: 'HTTP-01 Internal Server',
    FormComponent: Http01InternalFormFields,
    config_name: 'http_01_internal',
    blankConfig: {
      domains: [''],
      port: '',
    },
    validationErrorsFunc: validateHttp01Internal,
  },
];

// dummy provider holds a dummy component to prevent type invalid
// if something goes wrong
export const dummyProviderType = {
  value: '',
  FormComponent: DummyFormFields,
};
