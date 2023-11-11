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

// type basicGoodResponseType = z.infer<typeof basicGoodResponse>;
// const isBasicGoodResponseType = (
//   unk: unknown
// ): unk is basicGoodResponseType => {
//   const { success } = basicGoodResponse.safeParse(unk);
//   return success;
// };

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
  access_token: z.string(),
  access_token_claims: authorizationTokenClaims,
  session_token_claims: authorizationTokenClaims,
});

export type authorizationType = z.infer<typeof authorization>;
export const isAuthorizationType = (unk: unknown): unk is authorizationType => {
  const { success } = authorization.safeParse(unk);
  return success;
};

const authorizationResponse = basicGoodResponse.extend({
  authorization: authorization,
});

export type authorizationResponseType = z.infer<typeof authorizationResponse>;
export const isAuthorizationResponseType = (
  unk: unknown
): unk is authorizationResponseType => {
  const { success } = authorizationResponse.safeParse(unk);
  return success;
};

// logout
const logoutResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type logoutResponseType = z.infer<typeof logoutResponse>;
export const isLogoutResponseType = (
  unk: unknown
): unk is logoutResponseType => {
  const { success } = logoutResponse.safeParse(unk);
  return success;
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
export const isNewVersionResponseType = (
  unk: unknown
): unk is newVersionResponseType => {
  const { success } = newVersionResponse.safeParse(unk);
  return success;
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
export const isBackendStatusResponse = (
  unk: unknown
): unk is backendStatusResponseType => {
  const { success } = backendStatusResponse.safeParse(unk);
  return success;
};

// change password
const changePasswordResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type changePasswordResponseType = z.infer<typeof changePasswordResponse>;
export const isChangePasswordResponse = (
  unk: unknown
): unk is changePasswordResponseType => {
  const { success } = changePasswordResponse.safeParse(unk);
  return success;
};

// shutdown & restart
const shutdownResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type shutdownResponseType = z.infer<typeof shutdownResponse>;
export const isShutdownResponse = (
  unk: unknown
): unk is shutdownResponseType => {
  const { success } = shutdownResponse.safeParse(unk);
  return success;
};

const restartResponse = basicGoodResponse.extend({
  status_code: z.literal(200),
});

export type restartResponseType = z.infer<typeof restartResponse>;
export const isRestartResponse = (unk: unknown): unk is restartResponseType => {
  const { success } = restartResponse.safeParse(unk);
  return success;
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
export const isCurrentValidOrdersResponseType = (
  unk: unknown
): unk is currentValidOrdersResponseType => {
  const { success } = currentValidOrdersResponse.safeParse(unk);
  return success;
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
export const isAcmeServersResponseType = (
  unk: unknown
): unk is acmeServersResponseType => {
  const { success } = acmeServersResponse.safeParse(unk);
  return success;
};
