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
    name: 'form.key_source',
    errorMessage: 'Key source must be selected.',
    type: 'number',
  },
  {
    name: 'form.private_key_id',
    errorMessage: 'A private key must be selected.',
    type: 'number',
  },
];

// fieldInformation returns information for the named field
const fieldInformation = (fieldName) => {
  // find desired field's info
  const thisFieldInfo = fieldsInfo.find((field) => {
    return fieldName.startsWith(field.name);
  });

  // return object rules and error message, or generic if doesn't exist
  return {
    errorMessage: thisFieldInfo?.errorMessage || 'This field has an error.',
    type: thisFieldInfo?.type || 'text',
  };
};

export default fieldInformation;
