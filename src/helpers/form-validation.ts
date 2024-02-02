// check if name is valid (only permitted to contain URL path chars)
export const isNameValid = (name: string): boolean => {
  // don't allow blank name
  if (name.length === 0) {
    return false;
  }

  // match anything not valid ( A-Z, a-z, 0-9, -_.~ )
  const regex = /[^-_.~A-z0-9]|[\^]/g;
  if (name.match(regex)) {
    return false;
  }

  return true;
};

// check if an email address is in a valid email address format
export const isEmailValid = (email: string): boolean => {
  // valid email regex
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(regex)) {
    return true;
  }

  return false;
};

// check if string is a valid domain format (defaults to allowing a wildcard
// subdomain as well)
export const isDomainValid = (
  domain: string,
  allowWildSubdomain: boolean = true
): boolean => {
  // depending on what is being validated, wild subdomain prefix allowed is optional
  // e.g. RFC 8555 7.1.3 allows wildcard
  if (allowWildSubdomain) {
    // if string prefix is wildcard ("*."), remove it and then validate the remainder
    // if the prefix is not *. this call is a no-op
    domain = domain.replace(/^\*\./, '');
  }

  // valid domain regex
  const regex =
    /^(([A-Za-z0-9][A-Za-z0-9-]{0,61}\.)*([A-Za-z0-9][A-Za-z0-9-]{0,61}\.)[A-Za-z][A-Za-z0-9-]{0,61}[A-Za-z0-9])$/;
  if (domain.match(regex)) {
    return true;
  }

  return false;
};

// isDirectoryUrlValid validates an acme server url. It verifies the url
// contains only valid chars and starts with https.
export const isDirectoryUrlValid = (url: string): boolean => {
  // https://en.wikipedia.org/wiki/Percent-encoding#Types_of_URI_characters
  const regex = /^[A-Za-z0-9-_.~!#$&'()*+,/:;=?@%[\]]*$/;
  if (!url.match(regex)) {
    return false;
  }

  return url.startsWith('https://');
};

// isPortValid confirms that port is a number and is between the range
// of 1 to 65535, inclusive
export const isPortValid = (port: number): boolean => {
  // invalid port - out of range
  if (port < 1 || port > 65535) {
    return false;
  }

  return true;
};
