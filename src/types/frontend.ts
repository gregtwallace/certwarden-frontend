import { type inputHandlerFuncType } from '../helpers/input-handler';
import { z } from 'zod';

// Frontend Error - generic error object for the frontend app,
// this may hold a backend error or it may not
const frontendError = z.object({
  statusCode: z.union([z.number(), z.string()]),
  message: z.string(),
});

export type frontendErrorType = z.infer<typeof frontendError>;

//
// Validation Errors Shape
//
const validationErrors = z.record(z.string(), z.boolean());

export type validationErrorsType = z.infer<typeof validationErrors>;

//
// Providers
//

// config types (for state / form)
const providerHttp01InternalConfig = z.object({
  domains: z.array(z.string()),
  port: z.number(),
});

const providerDns01ManualConfig = z.object({
  domains: z.array(z.string()),
  environment: z.array(z.string()),
  create_script: z.string(),
  delete_script: z.string(),
});

const providerDns01AcmeDnsConfig = z.object({
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
});

const providerDns01AcmeShConfig = z.object({
  domains: z.array(z.string()),
  acme_sh_path: z.string(),
  environment: z.array(z.string()),
  dns_hook: z.string(),
});

const providerDns01CloudflareConfig = z.union([
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
]);

const providerConfig = z.union([
  providerHttp01InternalConfig,
  providerDns01ManualConfig,
  providerDns01AcmeDnsConfig,
  providerDns01AcmeShConfig,
  providerDns01CloudflareConfig,
]);

export type providerConfigType = z.infer<typeof providerConfig>;

// form state
const providerFormState = z.object({
  provider_type_value: z.string(),
  provider_options: z.union([z.record(z.string(), z.unknown()), z.undefined()]),
  dataToSubmit: z.union([
    providerConfig,
    z.object({ domains: z.array(z.string()) }), // blank, just domain, akin to undefined
  ]),
  sendError: z.union([
    z.object({
      statusCode: z.union([z.number(), z.string()]),
      message: z.string(),
    }),
    z.undefined(),
  ]),
  validationErrors: z.record(z.string(), z.boolean()),
});

export type providerFormStateType = z.infer<typeof providerFormState>;

export type providerSubFormPropsType = {
  formState: providerFormStateType;
  onChange: inputHandlerFuncType;
};
