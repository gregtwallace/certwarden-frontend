import { z } from 'zod';

// field names with w/ some info about them
const _htmlTypeVal = z.enum([
  'checkbox',
  'email',
  'number',
  'password',
  'text',
  'url',
]);
type htmlTypeValType = z.infer<typeof _htmlTypeVal>;

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
    nameRegex: /^(.+\.)?api_key_via_url$/,
    htmlType: 'checkbox',
    errorMessage: 'N/A',
  },
  {
    nameRegex: /^(.+\.)?username$/,
    htmlType: 'text',
    errorMessage: 'Username cannot be blank.',
  },
  {
    // note: exlude numbers so arrays of (e.g. acme-dns) password aren't matched
    nameRegex: /^([^0-9]+\.)?password$/,
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
  {
    nameRegex: /^(.+\.)?is_staging$/,
    htmlType: 'checkbox',
    errorMessage: 'N/A',
  },

  // account
  {
    nameRegex: /^(.+\.)?acme_account_id$/,
    htmlType: 'number',
    errorMessage: 'An account must be selected.',
  },
  {
    nameRegex: /^(.+\.)?kid$/,
    htmlType: 'text',
    errorMessage: 'N/A',
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
  {
    nameRegex: /^(.+\.)?url$/,
    htmlType: 'text',
    errorMessage: 'URL must be https and valid.',
  },

  // certificate
  {
    nameRegex: /^(.+\.)?subject(_alts\.[0-9]+)?$/,
    htmlType: 'url',
    errorMessage:
      'Subject name must be a valid (sub)domain and may start with a wildcard (*.).',
  },

  {
    nameRegex: /^(.+\.)?post_processing_client_address$/,
    htmlType: 'text',
    errorMessage: 'If specified, address must be a valid domain name.',
  },
  {
    nameRegex: /^(.+\.)?post_processing_client_key$/,
    htmlType: 'text',
    errorMessage: 'N/A',
  },
  {
    nameRegex: /^(.+\.)?post_processing_command$/,
    htmlType: 'text',
    errorMessage: 'N/A',
  },
  {
    nameRegex: /^(.+\.)?post_processing_environment\.[0-9]+$/,
    htmlType: 'text',
    errorMessage:
      'Param format must be `NAME=value`. NAME must contain letters, numbers, and _ only and start with a letter.',
  },

  {
    nameRegex: /^(.+\.)?preferred_root_cn$/,
    htmlType: 'url',
    errorMessage: 'N/A / TODO: If ever validate CSR',
  },
  {
    nameRegex: /^(.+\.)?country$/,
    htmlType: 'url',
    errorMessage: 'N/A / TODO: If ever validate CSR',
  },
  {
    nameRegex: /^(.+\.)?state$/,
    htmlType: 'url',
    errorMessage: 'N/A / TODO: If ever validate CSR',
  },
  {
    nameRegex: /^(.+\.)?city$/,
    htmlType: 'url',
    errorMessage: 'N/A / TODO: If ever validate CSR',
  },
  {
    nameRegex: /^(.+\.)?organization$/,
    htmlType: 'url',
    errorMessage: 'N/A / TODO: If ever validate CSR',
  },
  {
    nameRegex: /^(.+\.)?organizational_unit$/,
    htmlType: 'url',
    errorMessage: 'N/A / TODO: If ever validate CSR',
  },

  // {
  //   nameRegex: /^(.+\.)?csr_extra_extensions\.[0-9]+.description$/,
  //   htmlType: 'text',
  //   errorMessage: 'N/A',
  // },
  {
    nameRegex: /^(.+\.)?csr_extra_extensions\.[0-9]+.oid$/,
    htmlType: 'text',
    errorMessage: 'OID must be in dot notation format.',
  },
  {
    nameRegex: /^(.+\.)?csr_extra_extensions\.[0-9]+.value_hex$/,
    htmlType: 'text',
    errorMessage:
      'Hex bytes value must be a valid sequence of concatenated hex bytes.',
  },
  {
    nameRegex: /^(.+\.)?csr_extra_extensions\.[0-9]+.critical$/,
    htmlType: 'checkbox',
    errorMessage: 'N/A',
  },

  // orders
  {
    nameRegex: /^(.+\.)?reason_code$/,
    htmlType: 'number',
    errorMessage: 'Reason code must be selected.',
  },

  // challenges: providers
  {
    nameRegex: /^(.+\.)?domains\.[0-9]+$/,
    htmlType: 'text',
    errorMessage:
      'Domain must be valid. Or for a wildcard provider use one domain set to * .',
  },
  {
    nameRegex: /^(.+\.)?precheck_wait$/,
    htmlType: 'number',
    errorMessage: 'N/A',
  },
  {
    nameRegex: /^(.+\.)?postcheck_wait$/,
    htmlType: 'number',
    errorMessage: 'N/A',
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
    errorMessage:
      "An acme-dns server address must be specified and begin with 'https://'.",
  },
  {
    nameRegex: /^(.+\.)?resources\.[0-9]+.real_domain$/,
    htmlType: 'text',
    errorMessage: 'Real domain must be populated with a valid domain.',
  },
  {
    nameRegex: /^(.+\.)?resources\.[0-9]+.full_domain$/,
    htmlType: 'text',
    errorMessage: 'Full domain must be populated with a valid domain.',
  },
  {
    nameRegex: /^(.+\.)?resources\.[0-9]+.username$/,
    htmlType: 'text',
    errorMessage: 'Username must be populated.',
  },
  {
    nameRegex: /^(.+\.)?resources\.[0-9]+.password$/,
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
    nameRegex: /^(.+\.)?environment\.[0-9]+$/,
    htmlType: 'text',
    errorMessage:
      'Param format must be `NAME=value`. NAME must contain letters, numbers, and _ only and start with a letter.',
  },
  {
    nameRegex: /^(.+\.)?dns_provider_name$/,
    htmlType: 'text',
    errorMessage: 'CLI flag name (i.e. Code) must be specified.',
  },

  // challenges: aliases
  {
    nameRegex: /^(.+\.)?domain_aliases\.[0-9]+.challenge_domain$/,
    htmlType: 'text',
    errorMessage: 'Challenge domain must be valid and not duplicated.',
  },
  {
    nameRegex: /^(.+\.)?domain_aliases\.[0-9]+.provision_domain$/,
    htmlType: 'text',
    errorMessage: 'Provision domain must be valid.',
  },

  // backup and restore
  {
    nameRegex: /^(.+\.)?with_log_files$/,
    htmlType: 'checkbox',
    errorMessage: 'N/A',
  },
  {
    nameRegex: /^(.+\.)?with_on_disk_backups$/,
    htmlType: 'checkbox',
    errorMessage: 'N/A',
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
