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
  // general
  {
    nameRegex: /^(.+\.)?name$/,
    htmlType: 'text',
    errorMessage:
      'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.',
  },
  {
    nameRegex: /^(.+\.)?description$/,
    htmlType: 'text',
    errorMessage: 'N/A',
  },
  {
    nameRegex: /^(.+\.)?email$/,
    htmlType: 'email',
    errorMessage: 'Email must be specified and in a valid format.',
  },
  {
    nameRegex: /^(.+\.)?api_key(_new)?$/,
    htmlType: 'text',
    errorMessage: 'API keys must be at least 10 characters long.',
  },
  {
    nameRegex: /^(.+\.)?api_key_disabled$/,
    htmlType: 'checkbox',
    errorMessage: 'N/A',
  },
  {
    nameRegex: /^(.+\.)?username$/,
    htmlType: 'text',
    errorMessage: 'Username cannot be blank.',
  },
  {
    nameRegex: /^(.+\.)?password$/,
    htmlType: 'password',
    errorMessage: 'Password cannot be blank.',
  },
  {
    nameRegex: /^(.+\.)?current_password$/,
    htmlType: 'password',
    errorMessage: 'Current password must not be blank.',
  },
  {
    nameRegex: /^(.+\.)?new_password$/,
    htmlType: 'password',
    errorMessage: 'New password must not be blank.',
  },
  {
    nameRegex: /^(.+\.)?confirm_new_password$/,
    htmlType: 'password',
    errorMessage: 'Password confirmation must match new password.',
  },

  // private key
  {
    nameRegex: /^(.+\.)?private_key_id$/,
    htmlType: 'number',
    errorMessage: 'A private key must be selected.',
  },
  {
    nameRegex: /^(.+\.)?key_source$/,
    htmlType: 'number',
    errorMessage: 'Key source must be selected.',
  },
  {
    nameRegex: /^(.+\.)?algorithm_value$/,
    htmlType: 'text',
    errorMessage: 'Algorithm must be selected to generate a key.',
  },
  {
    nameRegex: /^(.+\.)?pem$/,
    htmlType: 'text',
    errorMessage: 'PEM formatted key must be pasted in.',
  },

  // acme server
  {
    nameRegex: /^(.+\.)?acme_server_id$/,
    htmlType: 'number',
    errorMessage: 'An ACME server must be selected.',
  },
  {
    nameRegex: /^(.+\.)?directory_url$/,
    htmlType: 'url',
    errorMessage:
      'Directory URL must be https and only contain valid URI characters.',
  },

  // account
  {
    nameRegex: /^(.+\.)?acme_account_id$/,
    htmlType: 'number',
    errorMessage: 'An account must be selected.',
  },
  {
    nameRegex: /^(.+\.)?accepted_tos$/,
    htmlType: 'checkbox',
    errorMessage: 'You must accept the Terms of Service.',
  },
  {
    nameRegex: /^(.+\.)?eab_hmac_key$/,
    htmlType: 'text',
    errorMessage: 'External Account Binding requires a Key.',
  },
  {
    nameRegex: /^(.+\.)?eab_kid$/,
    htmlType: 'text',
    errorMessage: 'External Account Binding requires a Key ID.',
  },

  // certificate
  {
    nameRegex: /^(.+\.)?subject(_alts.[0-9]+)?$/,
    htmlType: 'url',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },

  // providers
  {
    nameRegex: /^(.+\.)?domains.[0-9]+$/,
    htmlType: 'text',
    errorMessage:
      'Domain must be valid. Or for a wildcard provider use one domain set to * .',
  },
  {
    nameRegex: /^(.+\.)?provider_type_value$/,
    htmlType: 'text',
    errorMessage: 'Provider type must be selected.',
  },
  {
    nameRegex: /^(.+\.)?api_access_method$/,
    htmlType: 'text',
    errorMessage: 'API Access Method must be selected.',
  },
  {
    nameRegex: /^(.+\.)?port$/,
    htmlType: 'number',
    errorMessage: 'Port number must be between 1 and 65535.',
  },
  {
    nameRegex: /^(.+\.)?api_token$/,
    htmlType: 'text',
    errorMessage: 'API token must be specified.',
  },
  {
    nameRegex: /^(.+\.)?account.global_api_key$/,
    htmlType: 'text',
    errorMessage: 'Global API key must be specified.',
  },
  {
    nameRegex: /^(.+\.)?acme_dns_address$/,
    htmlType: 'url',
    errorMessage: 'An acme-dns server address must be specified.',
  },
  {
    nameRegex: /^(.+\.)?resources.[0-9]+.real_domain$/,
    htmlType: 'text',
    errorMessage: 'Real domain must be populated.',
  },
  {
    nameRegex: /^(.+\.)?resources.[0-9]+.full_domain$/,
    htmlType: 'text',
    errorMessage: 'Full domain must be populated.',
  },
  {
    nameRegex: /^(.+\.)?resources.[0-9]+.username$/,
    htmlType: 'text',
    errorMessage: 'Username must be populated.',
  },
  {
    nameRegex: /^(.+\.)?resources.[0-9]+.password$/,
    htmlType: 'text', // deliberately not hidden with 'password'
    errorMessage: 'Password must be populated.',
  },
  {
    nameRegex: /^(.+\.)?acme_sh_path$/,
    htmlType: 'text',
    errorMessage: 'acme.sh install path must be specified.',
  },
  {
    nameRegex: /^(.+\.)?dns_hook$/,
    htmlType: 'text',
    errorMessage: 'DNS hook name must be specified.',
  },
  {
    nameRegex: /^(.+\.)?create_script$/,
    htmlType: 'text',
    errorMessage: 'Script path must be specified.',
  },
  {
    nameRegex: /^(.+\.)?delete_script$/,
    htmlType: 'text',
    errorMessage: 'Script path must be specified.',
  },
  {
    nameRegex: /^(.+\.)?environment.[0-9]+$/,
    htmlType: 'text',
    errorMessage: 'Environment variables should be specified.',
  },
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
