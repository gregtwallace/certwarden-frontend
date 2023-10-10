// fieldsInfo contains information about field names
const fieldsInfo = [
  {
    name: 'form.accepted_tos',
    errorMessage: 'You must accept the Terms of Service.',
  },
  {
    name: 'form.acme_account_id',
    errorMessage: 'An account must be selected.',
    type: 'number',
  },
  {
    name: 'form.acme_server_id',
    errorMessage: 'An ACME server must be selected.',
    type: 'number',
  },
  {
    name: 'form.algorithm_value',
    errorMessage: 'Algorithm must be selected to generate a key.',
  },
  {
    name: 'form.api_key',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    name: 'form.api_key_new',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    name: 'form.current_password',
    type: 'password',
  },
  {
    name: 'form.confirm_new_password',
    errorMessage: 'Password confirmation must match new password.',
    type: 'password',
  },
  {
    name: 'form.directory_url',
    errorMessage: 'Directory URL must be https.',
  },
  {
    name: 'form.domains',
    errorMessage:
      'Domain must be valid. Or for a wildcard provider use one domain set to ' *
      '.',
  },
  {
    name: 'form.eab_hmac_key',
    errorMessage: 'External Account Binding requires a Key.',
  },
  {
    name: 'form.eab_kid',
    errorMessage: 'External Account Binding requires a Key ID.',
  },
  {
    name: 'form.email',
    errorMessage: 'Email address must be in a valid format.',
  },
  {
    name: 'key_source',
    errorMessage: 'Key source must be selected.',
    type: 'number',
  },
  {
    name: 'form.name',
    errorMessage:
      'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.',
  },
  {
    name: 'form.new_password',
    errorMessage: 'New password must be at least 10 characters long.',
    type: 'password',
  },
  {
    name: 'form.pem',
    errorMessage: 'PEM formatted key must be pasted in.',
  },
  {
    name: 'form.port',
    errorMessage: 'Port number must be between 1 and 65535.',
    type: 'number',
  },
  {
    name: 'form.private_key_id',
    errorMessage: 'A private key must be selected.',
    type: 'number',
  },
  {
    name: 'form.subject',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },
  {
    name: 'form.subject_alts',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },
  // {
  //   name: 'form.',
  //   errorMessage: '',
  // },
];

// fieldInformation returns information for the named field
const fieldInformation = (fieldName) => {
  // check if ends in underscore number, indicating an array member
  // if part of array, strip the index portion of name to get field's real name
  fieldName = fieldName.replace(/_[0-9]+$/, '');

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
