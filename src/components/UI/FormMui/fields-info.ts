import { z } from 'zod';

// field names with w/ some info about them
const htmlTypeVal = z.enum([
  'checkbox',
  'email',
  'number',
  'password',
  'text',
  'url',
]);
type htmlTypeValType = z.infer<typeof htmlTypeVal>;

type fieldInfoType = {
  nameRegex: RegExp;
  htmlType: htmlTypeValType;
  errorMessage: string;
};
// fieldsInfo contains information about field names
const fieldsInfo: fieldInfoType[] = [
  {
    nameRegex: /^dataToSubmit.accepted_tos$/,
    htmlType: 'checkbox',
    errorMessage: 'You must accept the Terms of Service.',
  },
  {
    nameRegex: /^dataToSubmit.account.email$/,
    htmlType: 'email',
    errorMessage: 'Account email must be specified and in a valid format.',
  },
  {
    nameRegex: /^dataToSubmit.account.global_api_key$/,
    htmlType: 'text',
    errorMessage: 'Global API key must be specified.',
  },
  {
    nameRegex: /^dataToSubmit.acme_account_id$/,
    htmlType: 'number',
    errorMessage: 'An account must be selected.',
  },
  {
    nameRegex: /^dataToSubmit.acme_dns_address$/,
    htmlType: 'url',
    errorMessage: 'An acme-dns address must be specified.',
  },
  {
    nameRegex: /^dataToSubmit.acme_server_id$/,
    htmlType: 'number',
    errorMessage: 'An ACME server must be selected.',
  },
  {
    nameRegex: /^dataToSubmit.algorithm_value$/,
    htmlType: 'text',
    errorMessage: 'Algorithm must be selected to generate a key.',
  },
  {
    nameRegex: /^dataToSubmit.api_key$/,
    htmlType: 'text',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    nameRegex: /^dataToSubmit.api_key_new$/,
    htmlType: 'text',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    nameRegex: /^dataToSubmit.api_token$/,
    htmlType: 'text',
    errorMessage: 'API token must be specified.',
  },
  {
    nameRegex: /^dataToSubmit.current_password$/,
    htmlType: 'password',
    errorMessage: 'Current password must not be blank.',
  },
  {
    nameRegex: /^dataToSubmit.new_password$/,
    htmlType: 'password',
    errorMessage: 'New password must not be blank.',
  },
  {
    nameRegex: /^dataToSubmit.confirm_new_password$/,
    htmlType: 'password',
    errorMessage: 'Password confirmation must match new password.',
  },
  {
    nameRegex: /^dataToSubmit.directory_url$/,
    htmlType: 'url',
    errorMessage:
      'Directory URL must be https and only contain valid URI characters.',
  },
  {
    nameRegex: /dataToSubmit.domains.[1-9]*/,
    htmlType: 'text',
    errorMessage:
      'Domain must be valid. Or for a wildcard provider use one domain set to * .',
  },
  {
    nameRegex: /^dataToSubmit.eab_hmac_key$/,
    htmlType: 'text',
    errorMessage: 'External Account Binding requires a Key.',
  },
  {
    nameRegex: /^dataToSubmit.eab_kid$/,
    htmlType: 'text',
    errorMessage: 'External Account Binding requires a Key ID.',
  },
  {
    nameRegex: /^dataToSubmit.email$/,
    htmlType: 'email',
    errorMessage: 'Email address must be in a valid format.',
  },
  {
    nameRegex: /^dataToSubmit.name$/,
    htmlType: 'text',
    errorMessage:
      'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.',
  },
  {
    nameRegex: /^dataToSubmit.password$/,
    htmlType: 'password',
    errorMessage: 'Password cannot be blank.',
  },
  {
    nameRegex: /^dataToSubmit.pem$/,
    htmlType: 'text',
    errorMessage: 'PEM formatted key must be pasted in.',
  },
  {
    nameRegex: /^dataToSubmit.port$/,
    htmlType: 'number',
    errorMessage: 'Port number must be between 1 and 65535.',
  },
  {
    nameRegex: /^dataToSubmit.private_key_id$/,
    htmlType: 'number',
    errorMessage: 'A private key must be selected.',
  },
  {
    nameRegex: /^dataToSubmit.resources.[0-9]+.real_domain$/,
    htmlType: 'text',
    errorMessage: 'Real domain must be populated.',
  },
  {
    nameRegex: /^dataToSubmit.resources.[0-9]+.full_domain$/,
    htmlType: 'text',
    errorMessage: 'Full domain must be populated.',
  },
  {
    nameRegex: /^dataToSubmit.resources.[0-9]+.username$/,
    htmlType: 'text',
    errorMessage: 'Username must be populated.',
  },
  {
    nameRegex: /^dataToSubmit.resources.[0-9]+.password$/,
    htmlType: 'text', // deliberately not hidden with 'password'
    errorMessage: 'Password must be populated.',
  },
  {
    nameRegex: /^dataToSubmit.subject$/,
    htmlType: 'url',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },
  {
    nameRegex: /^dataToSubmit.subject_alts.[0-9]+$/,
    htmlType: 'url',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },
  {
    nameRegex: /^dataToSubmit.username$/,
    htmlType: 'text',
    errorMessage: 'Username cannot be blank.',
  },
  {
    nameRegex: /^dataToSubmit.acme_sh_path$/,
    htmlType: 'text',
    errorMessage: 'acme.sh install path must be specified.',
  },
  {
    nameRegex: /^dataToSubmit.dns_hook$/,
    htmlType: 'text',
    errorMessage: 'DNS hook name must be specified.',
  },
  {
    nameRegex: /^dataToSubmit.create_script$/,
    htmlType: 'text',
    errorMessage: 'Script path must be specified.',
  },
  {
    nameRegex: /^dataToSubmit.delete_script$/,
    htmlType: 'text',
    errorMessage: 'Script path must be specified.',
  },

  /* Other fields */

  {
    nameRegex: /^key_source$/,
    htmlType: 'number',
    errorMessage: 'Key source must be selected.',
  },
  {
    nameRegex: /^provider_type_value$/,
    htmlType: 'text',
    errorMessage: 'Provider type must be selected.',
  },
  {
    nameRegex: /^provider_options.api_access_method$/,
    htmlType: 'text',
    errorMessage: 'API Access Method must be selected.',
  },
  // {
  //   nameRegex: 'dataToSubmit.',
  //   htmlType: 'text'
  //   errorMessage: '',
  // },
];

// fieldInformation returns information for the named field
const fieldInformation = (
  fieldName: string
): { htmlType: htmlTypeValType; errorMessage: string } => {
  // find regex match
  const thisFieldInfo = fieldsInfo.find((field) => {
    return !!fieldName.match(field.nameRegex);
  });

  // if found
  if (thisFieldInfo) {
    return {
      htmlType: thisFieldInfo.htmlType,
      errorMessage: thisFieldInfo.errorMessage,
    };
  }

  // return default if field not found
  console.error(`field ${fieldName} not defined, report bug`);
  return {
    htmlType: 'text',
    errorMessage: 'This field has an error.',
  };
};

export default fieldInformation;
