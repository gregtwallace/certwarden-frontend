import { z } from 'zod';

// Note: Objects may be larger than described here. Only fields in use are specified
// to avoid unnecessary breakage if backend responses change without impacting the
// design of the frontend.

//
// Basic Responses
//

// Good Response
const basicGoodResponse = z.object({
  status_code: z.number().gte(200).lte(299),
  message: z.string(),
});

// Error Response
const errorResponse = z.object({
  status_code: z.number().gte(400).lte(599),
  message: z.string(),
});

export type errorResponseType = z.infer<typeof errorResponse>;
export const isErrorResponseType = (unk: unknown): unk is errorResponseType => {
  const { success } = errorResponse.safeParse(unk);
  return success;
};

//
// Authorization
//

// login and refresh
// storedAuthorization is used to check the validity of an auth in session storage
const storedAuthorization = z.object({
  user_type: z.string().min(1),
  access_token: z.string().min(1),
  access_token_exp: z.number(),
  session_exp: z.number().min(Date.now() / 1000, {
    message: 'session expired',
  }),
});

export type storedAuthorizationType = z.infer<typeof storedAuthorization>;
export const parseStoredAuthorizationType = (
  unk: unknown
): storedAuthorizationType => {
  return storedAuthorization.parse(unk);
};

// newAuthorization is used to check against backend's returned authorization
const newAuthorization = storedAuthorization.extend({
  access_token_exp: z.number().min(Date.now() / 1000, {
    message: 'access token expired (host or client time clock issue?)',
  }),
  session_exp: z.number().min(Date.now() / 1000, {
    message: 'session expired (host or client time clock issue?)',
  }),
});

const authorizationResponse = basicGoodResponse.extend({
  authorization: newAuthorization,
});

export type authorizationResponseType = z.infer<typeof authorizationResponse>;
export const parseAuthorizationResponseType = (
  unk: unknown
): authorizationResponseType => {
  return authorizationResponse.parse(unk);
};

// logout
const logoutResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type logoutResponseType = z.infer<typeof logoutResponse>;
export const parseLogoutResponseType = (unk: unknown): logoutResponseType => {
  return logoutResponse.parse(unk);
};

// auth status
const authStatusResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
  auth_status: z.object({
    local: z.object({
      enabled: z.boolean(),
    }),
    oidc: z.object({
      enabled: z.boolean(),
    }),
  }),
});

export type authStatusResponseType = z.infer<typeof authStatusResponse>;
export const parseAuthStatusResponseType = (
  unk: unknown
): authStatusResponseType => {
  return authStatusResponse.parse(unk);
};

//
// New Version
//

const newVersion = z.object({
  last_checked_time: z.number(),
  available: z.boolean(),
  config_version_matches: z.boolean(),
  database_version_matches: z.boolean(),
  info: z
    .object({
      channel: z.string(),
      version: z.string(),
      //   config_version: z.number(),
      //   database_version: z.number(),
      url: z.string(),
    })
    .optional(),
});

export type newVersionType = z.infer<typeof newVersion>;

const newVersionResponse = basicGoodResponse.extend({
  new_version: newVersion,
});

export type newVersionResponseType = z.infer<typeof newVersionResponse>;
export const parseNewVersionResponseType = (
  unk: unknown
): newVersionResponseType => {
  return newVersionResponse.parse(unk);
};

//
// Logs
//

const logEntry = z.object({
  level: z.string(),
  ts: z.string().datetime({ offset: true }),
  caller: z.string(),
  msg: z.string(),
});

const logResponse = basicGoodResponse.extend({
  log_entries: z.array(logEntry),
});

export type logResponseType = z.infer<typeof logResponse>;
export const parseLogResponseType = (unk: unknown): logResponseType => {
  return logResponse.parse(unk);
};

//
// Settings
//

// status
const backendStatusResponse = basicGoodResponse.extend({
  server: z.object({
    status: z.string(),
    log_level: z.string(),
    version: z.string(),
    config_version: z.number(),
    database_version: z.number(),
  }),
});

export type backendStatusResponseType = z.infer<typeof backendStatusResponse>;
export const parseBackendStatusResponse = (
  unk: unknown
): backendStatusResponseType => {
  return backendStatusResponse.parse(unk);
};

// change password
const changePasswordResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type changePasswordResponseType = z.infer<typeof changePasswordResponse>;
export const parseChangePasswordResponse = (
  unk: unknown
): changePasswordResponseType => {
  return changePasswordResponse.parse(unk);
};

// shutdown & restart
const shutdownResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type shutdownResponseType = z.infer<typeof shutdownResponse>;
export const parseShutdownResponse = (unk: unknown): shutdownResponseType => {
  return shutdownResponse.parse(unk);
};

const restartResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type restartResponseType = z.infer<typeof restartResponse>;
export const parseRestartResponse = (unk: unknown): restartResponseType => {
  return restartResponse.parse(unk);
};

// backup & restore
const backupFileDetails = z.object({
  name: z.string(),
  size: z.number(),
  modtime: z.number(),
  created_at: z.number().optional(),
});

const backupAllOnDiskResponse = basicGoodResponse.extend({
  config: z.object({
    enabled: z.boolean(),
    interval_days: z.number(),
    retention: z.object({
      max_days: z.number(),
      max_count: z.number(),
    }),
  }),
  backup_files: z.array(backupFileDetails),
});

export type backupAllOnDiskResponseType = z.infer<
  typeof backupAllOnDiskResponse
>;
export const parseBackupAllOnDiskResponseType = (
  unk: unknown
): backupAllOnDiskResponseType => {
  return backupAllOnDiskResponse.parse(unk);
};

const backupMakeResponse = basicGoodResponse.extend({
  status_code: z.literal(201),
  backup_file: backupFileDetails,
});

export type backupMakeResponseType = z.infer<typeof backupMakeResponse>;
export const parseBackupMakeResponseType = (
  unk: unknown
): backupMakeResponseType => {
  return backupMakeResponse.parse(unk);
};

const backupDeleteResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type backupDeleteResponseType = z.infer<typeof backupDeleteResponse>;
export const parseBackupDeleteResponseType = (
  unk: unknown
): backupDeleteResponseType => {
  return backupDeleteResponse.parse(unk);
};

//
// ACME Servers
//

const acmeServersResponse = basicGoodResponse.extend({
  total_records: z.number(),
  acme_servers: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      is_staging: z.boolean(),
      external_account_required: z.boolean(),
    })
  ),
});

export type acmeServersResponseType = z.infer<typeof acmeServersResponse>;
export const parseAcmeServersResponseType = (
  unk: unknown
): acmeServersResponseType => {
  return acmeServersResponse.parse(unk);
};

const oneAcmeServerResponse = basicGoodResponse.extend({
  acme_server: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    directory_url: z.string(),
    is_staging: z.boolean(),
    external_account_required: z.boolean(),
    raw_directory_response: z.null().or(z.object({}).passthrough()),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});
export type oneAcmeServerResponseType = z.infer<typeof oneAcmeServerResponse>;
export const parseOneAcmeServerResponseType = (
  unk: unknown
): oneAcmeServerResponseType => {
  return oneAcmeServerResponse.parse(unk);
};

const oneAcmeServerDeleteResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});
export type oneAcmeServerDeleteResponseType = z.infer<
  typeof oneAcmeServerDeleteResponse
>;
export const parseOneAcmeServerDeleteResponse = (
  unk: unknown
): oneAcmeServerDeleteResponseType => {
  return oneAcmeServerDeleteResponse.parse(unk);
};

//
// Private Keys
//

const privateKeysResponse = basicGoodResponse.extend({
  total_records: z.number(),
  private_keys: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      algorithm: z.object({
        value: z.string(),
        name: z.string(),
      }),
      api_key_disabled: z.boolean(),
      api_key_via_url: z.boolean(),
      last_access: z.number(),
    })
  ),
});

export type privateKeysResponseType = z.infer<typeof privateKeysResponse>;
export const parsePrivateKeysResponseType = (
  unk: unknown
): privateKeysResponseType => {
  return privateKeysResponse.parse(unk);
};

const onePrivateKeyResponse = basicGoodResponse.extend({
  private_key: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    algorithm: z.object({
      value: z.string(),
      name: z.string(),
    }),
    api_key_disabled: z.boolean(),
    api_key_via_url: z.boolean(),
    api_key: z.string(),
    api_key_new: z.string().optional(),
    last_access: z.number(),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});

export type onePrivateKeyResponseType = z.infer<typeof onePrivateKeyResponse>;
export const parseOnePrivateKeyResponseType = (
  unk: unknown
): onePrivateKeyResponseType => {
  return onePrivateKeyResponse.parse(unk);
};

const privateKeyDeleteResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type privateKeyDeleteResponseType = z.infer<
  typeof privateKeyDeleteResponse
>;
export const parsePrivateKeyDeleteResponseType = (
  unk: unknown
): privateKeyDeleteResponseType => {
  return privateKeyDeleteResponse.parse(unk);
};

const privateKeyOptionsResponse = basicGoodResponse.extend({
  private_key_options: z.object({
    key_algorithms: z.array(
      z.object({
        value: z.string(),
        name: z.string(),
      })
    ),
  }),
});

export type privateKeyOptionsResponseType = z.infer<
  typeof privateKeyOptionsResponse
>;
export const parsePrivateKeyOptionsResponseType = (
  unk: unknown
): privateKeyOptionsResponseType => {
  return privateKeyOptionsResponse.parse(unk);
};

//
// ACME Accounts
//

const acmeAccountsResponse = basicGoodResponse.extend({
  total_records: z.number(),
  acme_accounts: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      acme_server: z.object({
        is_staging: z.boolean(),
      }),
      private_key: z.object({
        id: z.number(),
        name: z.string(),
      }),
      status: z.string(),
      email: z.string(),
      kid: z.string(),
    })
  ),
});

export type acmeAccountsResponseType = z.infer<typeof acmeAccountsResponse>;
export const parseAcmeAccountsResponseType = (
  unk: unknown
): acmeAccountsResponseType => {
  return acmeAccountsResponse.parse(unk);
};

// one account
const oneAcmeAccountResponse = basicGoodResponse.extend({
  acme_account: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    acme_server: z.object({
      name: z.string(),
      is_staging: z.boolean(),
      external_account_required: z.boolean(),
    }),
    private_key: z.object({
      id: z.number(),
      name: z.string(),
      algorithm: z.object({
        name: z.string(),
      }),
    }),
    status: z.string(),
    email: z.string(),
    accepted_tos: z.boolean(),
    kid: z.string(),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});

export type oneAcmeAccountResponseType = z.infer<typeof oneAcmeAccountResponse>;
export const parseOneAcmeAccountResponseType = (
  unk: unknown
): oneAcmeAccountResponseType => {
  return oneAcmeAccountResponse.parse(unk);
};

// delete response
const acmeAccountDeleteResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type acmeAccountDeleteResponseType = z.infer<
  typeof acmeAccountDeleteResponse
>;
export const parseAcmeAccountDeleteResponseType = (
  unk: unknown
): acmeAccountDeleteResponseType => {
  return acmeAccountDeleteResponse.parse(unk);
};

// register response
const acmeAccountRegisterResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type acmeAccountRegisterResponseType = z.infer<
  typeof acmeAccountRegisterResponse
>;
export const parseAcmeAccountRegisterResponseType = (
  unk: unknown
): acmeAccountRegisterResponseType => {
  return acmeAccountRegisterResponse.parse(unk);
};

// refresh response
const acmeAccountRefreshResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type acmeAccountRefreshResponseType = z.infer<
  typeof acmeAccountRefreshResponse
>;
export const parseAcmeAccountRefreshResponseType = (
  unk: unknown
): acmeAccountRefreshResponseType => {
  return acmeAccountRefreshResponse.parse(unk);
};

// deactivate response
const acmeAccountDeactivateResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type acmeAccountDeactivateResponseType = z.infer<
  typeof acmeAccountDeactivateResponse
>;
export const parseAcmeAccountDeactivateResponseType = (
  unk: unknown
): acmeAccountDeactivateResponseType => {
  return acmeAccountDeactivateResponse.parse(unk);
};

// Post-as-Get response
const postAsGetResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
  url: z.string(),
  body: z.string(),
  headers: z.record(z.string(), z.array(z.string())),
});

export type postAsGetResponseType = z.infer<typeof postAsGetResponse>;
export const parsePostAsGetResponseType = (
  unk: unknown
): postAsGetResponseType => {
  return postAsGetResponse.parse(unk);
};

// response to get options for new/edit account
const acmeAccountOptionsResponse = basicGoodResponse.extend({
  acme_account_options: z.object({
    acme_servers: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        is_staging: z.boolean(),
        terms_of_service: z.string(),
      })
    ),
    private_keys: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        algorithm: z.object({
          name: z.string(),
        }),
      })
    ),
  }),
});

export type acmeAccountOptionsResponseType = z.infer<
  typeof acmeAccountOptionsResponse
>;
export const parseAcmeAccountOptionsResponse = (
  unk: unknown
): acmeAccountOptionsResponseType => {
  return acmeAccountOptionsResponse.parse(unk);
};

//
// Certificates
//

// many certs
const certificatesResponse = basicGoodResponse.extend({
  total_records: z.number(),
  certificates: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      // description: z.string(),
      private_key: z.object({
        id: z.number(),
        name: z.string(),
      }),
      acme_account: z.object({
        id: z.number(),
        name: z.string(),
        acme_server: z.object({
          // id: z.number(),
          // name: z.string(),
          is_staging: z.boolean(),
        }),
      }),
      subject: z.string(),
      api_key_via_url: z.boolean(),
      last_access: z.number(),
    })
  ),
});

export type certificatesResponseType = z.infer<typeof certificatesResponse>;
export const parseCertificatesResponseType = (
  unk: unknown
): certificatesResponseType => {
  return certificatesResponse.parse(unk);
};

// one cert
const oneCertificateResponse = basicGoodResponse.extend({
  certificate: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    private_key: z.object({
      id: z.number(),
      name: z.string(),
      algorithm: z.object({
        name: z.string(),
      }),
    }),
    acme_account: z.object({
      id: z.number(),
      name: z.string(),
      acme_server: z.object({
        id: z.number(),
        // name: z.string(),
        is_staging: z.boolean(),
      }),
    }),
    subject: z.string(),
    subject_alts: z.array(z.string()),
    api_key_via_url: z.boolean(),
    organization: z.string(),
    organizational_unit: z.string(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    csr_extra_extensions: z.array(
      z.object({
        description: z.string(),
        oid: z.string(),
        critical: z.boolean(),
        value_hex: z.string(),
      })
    ),
    preferred_root_cn: z.string(),
    profile: z.string(),
    tech_phone: z.string(),
    tech_email: z.string(),
    api_key: z.string(),
    api_key_new: z.string().optional(),
    post_processing_command: z.string(),
    post_processing_environment: z.array(z.string()),
    post_processing_client_address: z.string(),
    post_processing_client_key: z.string(),
    last_access: z.number(),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});

export type oneCertificateResponseType = z.infer<typeof oneCertificateResponse>;
export const parseOneCertificateResponseType = (
  unk: unknown
): oneCertificateResponseType => {
  return oneCertificateResponse.parse(unk);
};

// delete response
const certificateDeleteResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type certificateDeleteResponseType = z.infer<
  typeof certificateDeleteResponse
>;
export const parseCertificateDeleteResponseType = (
  unk: unknown
): certificateDeleteResponseType => {
  return certificateDeleteResponse.parse(unk);
};

// response to get options for new/edit cert
const certificateOptionsResponse = basicGoodResponse.extend({
  certificate_options: z.object({
    private_keys: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        algorithm: z.object({
          name: z.string(),
        }),
      })
    ),
    key_algorithms: z.array(
      z.object({
        value: z.string(),
        name: z.string(),
      })
    ),
    acme_accounts: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        acme_server: z.object({
          id: z.number(),
          is_staging: z.boolean(),
          profiles: z.record(z.string(), z.string()).optional(),
        }),
        status: z.string(),
        kid: z.string(),
      })
    ),
  }),
});

export type certificateOptionsResponseType = z.infer<
  typeof certificateOptionsResponse
>;
export const parseCertificateOptionsResponse = (
  unk: unknown
): certificateOptionsResponseType => {
  return certificateOptionsResponse.parse(unk);
};

//
// Orders
//

// one order
const order = z.object({
  fulfillment_worker: z.number().optional(),
  id: z.number(),
  certificate: z.object({
    id: z.number(),
    name: z.string(),
    acme_account: z.object({
      acme_server: z.object({
        is_staging: z.boolean(),
      }),
    }),
    subject: z.string(),
    api_key_via_url: z.boolean(),
    last_access: z.number(),
  }),
  status: z.string(),
  known_revoked: z.boolean(),
  dns_identifiers: z.array(z.string()),
  chain_root_cn: z.union([z.string(), z.null()]),
  profile: z.string().optional(),
  finalized_key: z.union([
    z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .optional(),
    z.null(),
  ]),
  valid_from: z.union([z.number(), z.null()]),
  valid_to: z.union([z.number(), z.null()]),
  renewal_info: z.union([
    z.object({
      suggestedWindow: z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
      }),
      retryAfter: z.coerce.date().optional(),
      explanationURL: z.string().optional(),
    }),
    z.null(),
  ]),
  created_at: z.number(),
});

export type orderType = z.infer<typeof order>;

// one order response
const orderResponse = basicGoodResponse.extend({
  order: order,
});

export type orderResponseType = z.infer<typeof orderResponse>;
export const parseOrderResponseType = (unk: unknown): orderResponseType => {
  return orderResponse.parse(unk);
};

// multiple orders response
const ordersResponse = basicGoodResponse.extend({
  total_records: z.number(),
  orders: z.array(order),
});

export type ordersResponseType = z.infer<typeof ordersResponse>;
export const parseOrdersResponseType = (unk: unknown): ordersResponseType => {
  return ordersResponse.parse(unk);
};

// order post process response
const orderPostProcessResponse = basicGoodResponse;

export type orderPostProcessResponseType = z.infer<
  typeof orderPostProcessResponse
>;
export const parseOrderPostProcessResponseType = (
  unk: unknown
): orderPostProcessResponseType => {
  return orderPostProcessResponse.parse(unk);
};

//
// Dashboard
//

const currentValidOrdersResponse = basicGoodResponse.extend({
  total_records: z.number(),
  orders: z.array(order),
});

export type currentValidOrdersResponseType = z.infer<
  typeof currentValidOrdersResponse
>;
export const parseCurrentValidOrdersResponseType = (
  unk: unknown
): currentValidOrdersResponseType => {
  return currentValidOrdersResponse.parse(unk);
};

//
// Order Work Queues
//

const orderJob = z.object({
  added_to_queue: z.number(),
  high_priority: z.boolean(),
  order: order,
});

const queueResponse = basicGoodResponse.extend({
  jobs_working: z.record(z.string(), z.union([orderJob, z.null()])),
  jobs_waiting: z.array(orderJob),
});

export type queueResponseType = z.infer<typeof queueResponse>;
export const parseQueueResponseType = (unk: unknown): queueResponseType => {
  return queueResponse.parse(unk);
};

//
// Challenges: Domain Aliases
//

const domainAliases = z.array(
  z.object({
    challenge_domain: z.string(),
    provision_domain: z.string(),
  })
);

export type domainAliasesType = z.infer<typeof domainAliases>;

// responses
const domainAliasesResponse = basicGoodResponse.extend({
  domain_aliases: domainAliases,
});

export type domainAliasesResponseType = z.infer<typeof domainAliasesResponse>;
export const parseDomainAliasesResponseType = (
  unk: unknown
): domainAliasesResponseType => {
  return domainAliasesResponse.parse(unk);
};

//
// Challenges: Providers
//

const providerBase = z.object({
  id: z.number(),
  tag: z.string(),
  type: z.string(),
  domains: z.array(z.string()),
  post_resource_provision_wait: z.number(),
  // provider is this + config: {}
});

// http 01: internal
const providerHttp01Internal = providerBase.extend({
  config: z.object({
    port: z.number(),
  }),
});

// dns 01: manual
const providerDns01Manual = providerBase.extend({
  config: z.object({
    environment: z.array(z.string()),
    create_script: z.string(),
    delete_script: z.string(),
  }),
});

// dns 01: acme dns
const providerDns01AcmeDns = providerBase.extend({
  config: z.object({
    acme_dns_address: z.string(),
    resources: z.array(
      z.object({
        real_domain: z.string(),
        full_domain: z.string(),
        username: z.string(),
        password: z.string(),
      })
    ),
  }),
});

// dns 01: acme sh
const providerDns01AcmeSh = providerBase.extend({
  config: z.object({
    acme_sh_path: z.string(),
    environment: z.array(z.string()),
    dns_hook: z.string(),
  }),
});

// dns 01: cloudflare
const providerDns01Cloudflare = providerBase.extend({
  config: z.union([
    // global account
    z.object({
      account: z.object({
        email: z.string(),
        global_api_key: z.string(),
      }),
    }),
    // scoped api token
    z.object({
      api_token: z.string(),
    }),
  ]),
});

// dns 01: go acme
const providerDns01GoAcme = providerBase.extend({
  config: z.object({
    dns_provider_name: z.string(),
    environment: z.array(z.string()),
  }),
});

const provider = z.union([
  providerHttp01Internal,
  providerDns01Manual,
  providerDns01AcmeDns,
  providerDns01AcmeSh,
  providerDns01Cloudflare,
  providerDns01GoAcme,
]);
export type providerType = z.infer<typeof provider>;

// responses
const providersResponse = basicGoodResponse.extend({
  providers: z.array(provider),
});

export type providersResponseType = z.infer<typeof providersResponse>;
export const parseProvidersResponseType = (
  unk: unknown
): providersResponseType => {
  return providersResponse.parse(unk);
};

const providerResponse = basicGoodResponse.extend({
  provider: provider,
});
export type providerResponseType = z.infer<typeof providerResponse>;
export const parseProviderResponseType = (
  unk: unknown
): providerResponseType => {
  return providerResponse.parse(unk);
};

const oneProviderDeleteResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});
export type oneProviderDeleteResponseType = z.infer<
  typeof oneProviderDeleteResponse
>;
export const parseOneProviderDeleteResponse = (
  unk: unknown
): oneProviderDeleteResponseType => {
  return oneProviderDeleteResponse.parse(unk);
};

//
// API Key Editing
//

// for parsing api responses to return an api_key edit object
const objectWithApiKeys = z.object({
  name: z.string(),
  description: z.string(),
  api_key: z.string(),
  api_key_new: z.string().optional(),
});

export type objectWithApiKeysType = z.infer<typeof objectWithApiKeys>;
const parseObjectWithApiKeys = (unk: unknown): objectWithApiKeysType => {
  return objectWithApiKeys.parse(unk);
};

// this parser allows multiple object types to be addressed by the one api key
// edit page
export const parseObjectWithApiKeysResponse = (
  unk: unknown
): objectWithApiKeysType => {
  // private key response
  try {
    const keyResponse = onePrivateKeyResponse.parse(unk);
    return parseObjectWithApiKeys(keyResponse.private_key);
  } catch (_) {
    // no-op
  }

  // certificate response
  try {
    const certResponse = oneCertificateResponse.parse(unk);
    return parseObjectWithApiKeys(certResponse.certificate);
  } catch (_) {
    // no-op
  }

  return objectWithApiKeys.parse(unk);
};
