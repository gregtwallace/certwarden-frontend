// fieldsInfo contains information about field names
const fieldsInfo = [
  {
    name: 'form.accepted_tos',
    errorMessage: 'You must accept the Terms of Service.',
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
