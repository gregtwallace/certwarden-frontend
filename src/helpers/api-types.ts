// authResponse is for /app/auth /login and /refresh endpoints
type authTokenClaimsType = {
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
  season_id: string;
};

const isAuthTokenClaims = (object: any): object is authTokenClaimsType =>
  object.sub &&
  typeof object?.sub === 'string' &&
  object.exp &&
  typeof object?.exp === 'number' &&
  object.nbf &&
  typeof object?.nbf === 'number' &&
  object.iat &&
  typeof object?.iat === 'number' &&
  object.session_id &&
  typeof object?.session_id === 'string';

export type authResponseType = {
  access_token: string;
  access_token_claims: authTokenClaimsType;
  session_token_claims: authTokenClaimsType;
};

export const isAuthResponse = (object: any): object is authResponseType =>
  object?.access_token &&
  typeof object.access_token === 'string' &&
  object?.access_token_claims &&
  isAuthTokenClaims(object.access_token_claims) &&
  object?.session_token_claims &&
  isAuthTokenClaims(object.session_token_claims);
