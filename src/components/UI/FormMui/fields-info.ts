// fieldsInfo contains information about field names
const fieldsInfo = [
  {
    name: 'dataToSubmit.accepted_tos',
    errorMessage: 'You must accept the Terms of Service.',
  },
  {
    name: 'dataToSubmit.account.email',
    errorMessage: 'Account email must be specified and in a valid format.',
  },
  {
    name: 'dataToSubmit.account.global_api_key',
    errorMessage: 'Global API key must be specified.',
  },
  {
    name: 'dataToSubmit.acme_account_id',
    errorMessage: 'An account must be selected.',
    type: 'number',
  },
  {
    name: 'dataToSubmit.acme_dns_address',
    errorMessage: 'An acme-dns address must be specified.',
  },
  {
    name: 'dataToSubmit.acme_server_id',
    errorMessage: 'An ACME server must be selected.',
    type: 'number',
  },
  {
    name: 'dataToSubmit.algorithm_value',
    errorMessage: 'Algorithm must be selected to generate a key.',
  },
  {
    name: 'dataToSubmit.api_key',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    name: 'dataToSubmit.api_key_new',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    name: 'dataToSubmit.api_token',
    errorMessage: 'API token must be specified.',
  },
  {
    name: 'dataToSubmit.current_password',
    type: 'password',
  },
  {
    name: 'dataToSubmit.confirm_new_password',
    errorMessage: 'Password confirmation must match new password.',
    type: 'password',
  },
  {
    name: 'dataToSubmit.directory_url',
    errorMessage: 'Directory URL must be https.',
  },
  {
    name: 'dataToSubmit.domains',
    errorMessage:
      'Domain must be valid. Or for a wildcard provider use one domain set to * .',
  },
  {
    name: 'dataToSubmit.eab_hmac_key',
    errorMessage: 'External Account Binding requires a Key.',
  },
  {
    name: 'dataToSubmit.eab_kid',
    errorMessage: 'External Account Binding requires a Key ID.',
  },
  {
    name: 'dataToSubmit.email',
    errorMessage: 'Email address must be in a valid format.',
  },
  {
    name: 'key_source',
    errorMessage: 'Key source must be selected.',
    type: 'number',
  },
  {
    name: 'dataToSubmit.name',
    errorMessage:
      'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.',
  },
  {
    name: 'dataToSubmit.new_password',
    errorMessage: 'New password must be at least 10 characters long.',
    type: 'password',
  },
  {
    name: 'dataToSubmit.password',
    type: 'password',
    errorMessage: 'Password cannot be blank.',
  },
  {
    name: 'dataToSubmit.pem',
    errorMessage: 'PEM formatted key must be pasted in.',
  },
  {
    name: 'dataToSubmit.port',
    errorMessage: 'Port number must be between 1 and 65535.',
    type: 'number',
  },
  {
    name: 'dataToSubmit.private_key_id',
    errorMessage: 'A private key must be selected.',
    type: 'number',
  },
  {
    name: 'dataToSubmit.resources',
    errorMessage: 'All fields of a resource must be populated.',
    type: 'number',
  },
  {
    name: 'dataToSubmit.subject',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },
  {
    name: 'dataToSubmit.subject_alts',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },
  {
    name: 'dataToSubmit.username',
    errorMessage: 'Username cannot be blank.',
  },
  {
    name: 'provider_options.api_access_method',
    errorMessage: 'API Access Method must be selected.',
  },
  // {
  //   name: 'form.',
  //   errorMessage: '',
  // },
];

// fieldInformation returns information for the named field
const fieldInformation = (
  fieldName: string
): { errorMessage: string; type: string } => {
  // check if ends in -number, indicating an array member
  // if part of array, strip the index portion of name to get field's real name
  fieldName = fieldName.replace(/-[0-9]+$/, '');

  // find desired field's info
  const thisFieldInfo = fieldsInfo.find((field) => {
    return fieldName === field.name;
  });

  // return object rules and error message, or generic if doesn't exist
  return {
    errorMessage: thisFieldInfo?.errorMessage || 'This field has an error.',
    type: thisFieldInfo?.type || 'text',
  };
};

export default fieldInformation;
