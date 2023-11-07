import { z } from 'zod';

// Note: Objects may be larger than described here. Only fields in use are specified
// to avoid unnecessary breakage if backend responses change without impacting the
// design of the frontend.

//
// Basic Responses
//

// Response
const basicResponse = z.object({
  status_code: z.number().gte(200).lte(299),
  message: z.string(),
});

export type basicResponseType = z.infer<typeof basicResponse>;
export const isBasicResponseType = (unk: unknown): unk is basicResponseType => {
  const { success } = basicResponse.safeParse(unk);
  return success;
};

// Error
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

const authorizationResponse = basicResponse.extend({
  authorization: authorization,
});

export type authorizationResponseType = z.infer<typeof authorizationResponse>;
export const isAuthorizationResponseType = (
  unk: unknown
): unk is authorizationResponseType => {
  const { success } = authorizationResponse.safeParse(unk);
  return success;
};

//
// New Version
//

const newVersion = z.object({
  last_checked_time: z.number(),
  available: z.boolean(),
  // config_version_matches: z.boolean(),
  // database_version_matches: z.boolean(),
  info: z.object({
    //   channel: z.string(),
    version: z.string(),
    //   config_version: z.number(),
    //   database_version: z.number(),
    url: z.string(),
  }),
});

export type newVersionType = z.infer<typeof newVersion>;

const newVersionResponse = basicResponse.extend({
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
// Dashboard
//

const currentValidOrdersResponse = basicResponse.extend({
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
