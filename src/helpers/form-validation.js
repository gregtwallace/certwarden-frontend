// check if name is valid (only permitted to contain URL path chars)
export const isNameValid = (name) => {
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
export const isEmailValid = (email) => {
  // valid email regex
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(regex)) {
    return true;
  }

  return false;
};

// check if string is a valid domain format
export const isDomainValid = (domain) => {
  // allow wildcard per RFC 8555 7.1.3
  // if string prefix is wildcard ("*."), remove it and then validate the remainder
  // if the prefix is not *. this call is a no-op
  domain = domain.replace(/^\*\./, '');

  // valid domain regex
  const regex =
    /^(([A-Za-z0-9][A-Za-z0-9-]{0,61}\.)*([A-Za-z0-9][A-Za-z0-9-]{0,61}\.)[A-Za-z][A-Za-z0-9-]{0,61}[A-Za-z0-9])$/;
  if (domain.match(regex)) {
    return true;
  }

  return false;
};

// isDirectoryUrlValid validates an acme server url. It only verifies
// the the url is https and relies on the backend for the rest.
export const isDirectoryUrlValid = (url) => {
  return url.startsWith('https://');
};

// isPortValid confirms that port is a number and is between the range
// of 1 to 65535, inclusive
export const isPortValid = (port) => {
  // port isn't a number
  if (typeof port !== 'number') {
    return false;
  }

  // invalid port - out of range
  if (port < 1 || port > 65535) {
    return false;
  }

  return true;
};
