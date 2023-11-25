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
const authorizationTokenClaims = z.object({
  exp: z.number(),
});

const authorization = z.object({
  access_token: z.string().min(1),
  access_token_claims: authorizationTokenClaims,
  session_token_claims: authorizationTokenClaims,
});

export type authorizationType = z.infer<typeof authorization>;
export const parseAuthorizationType = (unk: unknown): authorizationType => {
  return authorization.parse(unk);
};

const authorizationResponse = basicGoodResponse.extend({
  authorization: authorization,
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

//
// Dashboard
//

const currentValidOrdersResponse = basicGoodResponse.extend({
  total_records: z.number(),
  orders: z.array(
    z.object({
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
      }),
      valid_to: z.number(),
    })
  ),
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
    })
  ),
});

export type acmeAccountsResponseType = z.infer<typeof acmeAccountsResponse>;
export const parseAcmeAccountsResponseType = (
  unk: unknown
): acmeAccountsResponseType => {
  return acmeAccountsResponse.parse(unk);
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
    // private_key: z.object({
    //   id: z.number(),
    //   name: z.string(),
    // }),
    // acme_account: z.object({
    //   id: z.number(),
    //   name: z.string(),
    //   acme_server: z.object({
    //     // id: z.number(),
    //     // name: z.string(),
    //     is_staging: z.boolean(),
    //   }),
    // }),
    // subject: z.string(),
    // api_key_via_url: z.boolean(),
    api_key: z.string(),
    api_key_new: z.string().optional(),
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
          is_staging: z.boolean(),
        }),
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
// Order Queue
//

const orderFulfillerJob = z.object({
  added_to_queue: z.number(),
  high_priority: z.boolean(),
  order: z.object({
    id: z.number(),
    certificate: z.object({
      id: z.number(),
      name: z.string(),
      subject: z.string(),
    }),
  }),
});

const orderQueueResponse = basicGoodResponse.extend({
  worker_jobs: z.record(z.string(), z.union([orderFulfillerJob, z.null()])),
  jobs_waiting: z.array(orderFulfillerJob),
});

export type orderQueueResponseType = z.infer<typeof orderQueueResponse>;
export const parseOrderQueueResponseType = (
  unk: unknown
): orderQueueResponseType => {
  return orderQueueResponse.parse(unk);
};

//
// Providers
//

const providerBase = z.object({
  id: z.number(),
  tag: z.string(),
  type: z.string(),
  // provider is this + config: {}
});

// http 01: internal
const providerHttp01Internal = providerBase.extend({
  config: z.object({
    domains: z.array(z.string()),
    port: z.number(),
  }),
});

// dns 01: manual
const providerDns01Manual = providerBase.extend({
  config: z.object({
    domains: z.array(z.string()),
    environment: z.array(z.string()),
    create_script: z.string(),
    delete_script: z.string(),
  }),
});

// dns 01: acme dns
const providerDns01AcmeDns = providerBase.extend({
  config: z.object({
    domains: z.array(z.string()),
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
    domains: z.array(z.string()),
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
      domains: z.array(z.string()),
      account: z.object({
        email: z.string(),
        global_api_key: z.string(),
      }),
    }),
    // scoped api token
    z.object({
      domains: z.array(z.string()),
      api_token: z.string(),
    }),
  ]),
});

const provider = z.union([
  providerHttp01Internal,
  providerDns01Manual,
  providerDns01AcmeDns,
  providerDns01AcmeSh,
  providerDns01Cloudflare,
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
