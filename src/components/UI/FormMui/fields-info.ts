import { z } from 'zod';

// field names with w/ some info about them
const htmlType = z.enum([
  'checkbox',
  'email',
  'number',
  'password',
  'text',
  'url',
]);
type htmlTypeType = z.infer<typeof htmlType>;

const fieldInfo = z.object({
  name: z.string(),
  htmlType: htmlType,
  errorMessage: z.string(),
});

type fieldInfoType = z.infer<typeof fieldInfo>;

// fieldsInfo contains information about field names
const fieldsInfo: fieldInfoType[] = [
  {
    name: 'dataToSubmit.accepted_tos',
    htmlType: 'checkbox',
    errorMessage: 'You must accept the Terms of Service.',
  },
  {
    name: 'dataToSubmit.account.email',
    htmlType: 'email',
    errorMessage: 'Account email must be specified and in a valid format.',
  },
  {
    name: 'dataToSubmit.account.global_api_key',
    htmlType: 'text',
    errorMessage: 'Global API key must be specified.',
  },
  {
    name: 'dataToSubmit.acme_account_id',
    htmlType: 'number',
    errorMessage: 'An account must be selected.',
  },
  {
    name: 'dataToSubmit.acme_dns_address',
    htmlType: 'url',
    errorMessage: 'An acme-dns address must be specified.',
  },
  {
    name: 'dataToSubmit.acme_server_id',
    htmlType: 'number',
    errorMessage: 'An ACME server must be selected.',
  },
  {
    name: 'dataToSubmit.algorithm_value',
    htmlType: 'text',
    errorMessage: 'Algorithm must be selected to generate a key.',
  },
  {
    name: 'dataToSubmit.api_key',
    htmlType: 'text',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    name: 'dataToSubmit.api_key_new',
    htmlType: 'text',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    name: 'dataToSubmit.api_token',
    htmlType: 'text',
    errorMessage: 'API token must be specified.',
  },
  {
    name: 'dataToSubmit.current_password',
    htmlType: 'password',
    errorMessage: 'Current password must not be blank.',
  },
  {
    name: 'dataToSubmit.new_password',
    htmlType: 'password',
    errorMessage: 'New password must not be blank.',
  },
  {
    name: 'dataToSubmit.confirm_new_password',
    htmlType: 'password',
    errorMessage: 'Password confirmation must match new password.',
  },
  {
    name: 'dataToSubmit.directory_url',
    htmlType: 'url',
    errorMessage: 'Directory URL must be https and only contain valid URI characters.',
  },
  {
    name: 'dataToSubmit.domains',
    htmlType: 'text',
    errorMessage:
      'Domain must be valid. Or for a wildcard provider use one domain set to * .',
  },
  {
    name: 'dataToSubmit.eab_hmac_key',
    htmlType: 'text',
    errorMessage: 'External Account Binding requires a Key.',
  },
  {
    name: 'dataToSubmit.eab_kid',
    htmlType: 'text',
    errorMessage: 'External Account Binding requires a Key ID.',
  },
  {
    name: 'dataToSubmit.email',
    htmlType: 'email',
    errorMessage: 'Email address must be in a valid format.',
  },
  {
    name: 'key_source',
    htmlType: 'number',
    errorMessage: 'Key source must be selected.',
  },
  {
    name: 'dataToSubmit.name',
    htmlType: 'text',
    errorMessage:
      'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.',
  },
  {
    name: 'dataToSubmit.password',
    htmlType: 'password',
    errorMessage: 'Password cannot be blank.',
  },
  {
    name: 'dataToSubmit.pem',
    htmlType: 'text',
    errorMessage: 'PEM formatted key must be pasted in.',
  },
  {
    name: 'dataToSubmit.port',
    htmlType: 'number',
    errorMessage: 'Port number must be between 1 and 65535.',
  },
  {
    name: 'dataToSubmit.private_key_id',
    htmlType: 'number',
    errorMessage: 'A private key must be selected.',
  },
  {
    name: 'dataToSubmit.resources',
    htmlType: 'number',
    errorMessage: 'All fields of a resource must be populated.',
  },
  {
    name: 'dataToSubmit.subject',
    htmlType: 'url',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },
  {
    name: 'dataToSubmit.subject_alts',
    htmlType: 'url',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },
  {
    name: 'dataToSubmit.username',
    htmlType: 'text',
    errorMessage: 'Username cannot be blank.',
  },
  {
    name: 'provider_options.api_access_method',
    htmlType: 'text',
    errorMessage: 'API Access Method must be selected.',
  },
  // {
  //   name: 'dataToSubmit.',
  //   htmlType: 'text'
  //   errorMessage: '',
  // },
];

// fieldInformation returns information for the named field
const fieldInformation = (
  fieldName: string
): { htmlType: htmlTypeType; errorMessage: string } => {
  // check if ends in .number, indicating an array member
  // if part of array, strip the index portion of name to get field's real name
  fieldName = fieldName.replace(/.[0-9]+$/, '');

  // find desired field's info
  const thisFieldInfo = fieldsInfo.find((field) => {
    return fieldName === field.name;
  });

  // if found
  if (thisFieldInfo) {
    return {
      htmlType: thisFieldInfo.htmlType,
      errorMessage: thisFieldInfo.errorMessage,
    };
  }

  // return default if field not found
  return {
    htmlType: 'text',
    errorMessage: 'This field has an error.',
  };
};

export default fieldInformation;
