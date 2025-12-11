// isInteger returns true if the provided string is an integer; it is
// very strict and does not allow floats, whitespaces, etc.
export const isInteger = (maybeNumber: string): boolean => {
  const regex = /^[0-9]+$/;
  return regex.exec(maybeNumber) !== null;
};

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

// check if string is a valid domain format (defaults to allowing a wildcard
// subdomain as well)
export const isDomainValid = (
  domain: string,
  allowWildSubdomain = true
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
  if (regex.exec(domain)) {
    return true;
  }

  return false;
};

// isDomainAndPortValid validates if the string is a valid fqdn, with an optional colon followed
// by a port number
export const isDomainAndPortValid = (domain: string): boolean => {
  // split on colon
  const splitDomain = domain.split(':');

  // bad split, no domain
  if (splitDomain[0] === undefined) {
    return false;
  }
  // bad split, too many pieces
  if (splitDomain.length > 2) {
    return false;
  }

  // port?
  if (splitDomain.length === 2) {
    // shouldn't ever happen
    if (splitDomain[1] === undefined) {
      return false;
    }

    // validate port
    const portNumb = parseInt(splitDomain[1]);
    if (portNumb < 0 || portNumb > 65535) {
      return false;
    }
  }

  // valid domain regex
  const regex =
    /^(([A-Za-z0-9][A-Za-z0-9-]{0,61}\.)*([A-Za-z0-9][A-Za-z0-9-]{0,61}\.)[A-Za-z][A-Za-z0-9-]{0,61}[A-Za-z0-9])$/;
  if (regex.exec(splitDomain[0])) {
    return true;
  }

  return false;
};

// isEmailValid returns true if the string is a validly formatted email address
export const isEmailValid = (email: string): boolean => {
  // split on the @ symbol
  const emailPieces = email.split('@');

  // invalid if not exactly 2 pieces
  if (emailPieces.length != 2) {
    return false;
  }

  // label each piece
  const username = emailPieces[0] ?? '';
  const domain = emailPieces[1] ?? '';

  // username regex
  const usernameRegex = /^[A-Za-z0-9][A-Za-z0-9-_.+]{0,62}[A-Za-z0-9]$/;
  if (!usernameRegex.exec(username)) {
    // no match = invalid username
    return false;
  }

  // check for invalid consecutive special chars in username
  const usernameConsecSpecialRegex = /[-_.+]{2,}/;
  if (usernameConsecSpecialRegex.exec(username)) {
    // match = invalid consecutive special chars
    return false;
  }

  // validate domain
  if (!isDomainValid(domain, false)) {
    // if domain not valid, email is invalid
    return false;
  }

  return true;
};

// isHttpsUrlValid validates a string only contains url chars and also that
// the string starts with `https://`
export const isHttpsUrlValid = (url: string): boolean => {
  if (!url.startsWith('https://')) {
    return false;
  }

  // https://en.wikipedia.org/wiki/Percent-encoding#Types_of_URI_characters
  const regex = /^[A-Za-z0-9-_.~!#$&'()*+,/:;=?@%[\]]*$/;
  if (!regex.exec(url)) {
    return false;
  }

  return true;
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

// isOIDValid returns true if the string is a valid dot notation OID
export const isOIDValid = (oid: string): boolean => {
  // split on dots
  const oidParts = oid.split('.');

  // each member should be a valid number
  try {
    oidParts.forEach((elem) => {
      // on any not a number, abort and return invalid
      if (!isInteger(elem)) {
        throw new Error('not a number');
      }
    });
  } catch (_err) {
    return false;
  }

  // no elems invalid, so OID is valid
  return true;
};

// isHexStringValid returns true the string is valid hex content either without
// any separator or with space or colon separator (mix and match of these options
// is not allow though -- e.g. `aabb:cc` or `aa bbcc` are both invalid)
export const isHexStringValid = (hex: string): boolean => {
  let hexParts: string[] = [];
  if (hex.includes(':')) {
    // using : separator
    hexParts = hex.split(':');
  } else if (hex.includes(' ')) {
    // using [space] separator
    hexParts = hex.split(' ');
  }

  // if we made parts, build hex without separator string from them, if we did
  // not, use original hex value
  let valueHexNoSep = '';
  if (hexParts.length > 0) {
    try {
      // each byte must be 2 chars, if not, throw err to break early and return
      // invalid (i.e. false)
      hexParts.forEach((elem) => {
        if (elem.length != 2) {
          throw new Error('not a valid byte length');
        }

        valueHexNoSep += elem;
      });
    } catch (_err) {
      return false;
    }
  } else {
    valueHexNoSep = hex;
  }

  // verify only valid hex chars in hex string && must be length that is a multiple
  // of 2 (since each byte is 2 hex chars)
  const regex = /^[A-Fa-f0-9]*$/;
  if (valueHexNoSep.length % 2 !== 0 || !regex.exec(valueHexNoSep)) {
    return false;
  }

  return true;
};

// isEnvironmentParamValid returns true if the environment param is in proper
// format for the backend (e.g. VAR=some_val)
// Note: Backend doesn't check this, it just discards invalid. Frontend can prevent
// saving bad ones to begin with though
export const isEnvironmentParamValid = (envParam: string): boolean => {
  // check for separator =
  const indexOfEqual = envParam.indexOf('=');
  if (indexOfEqual < 0) {
    // invalid param (no equal sign)
    return false;
  }

  // get param name
  let paramName = envParam.substring(0, indexOfEqual);
  // no checks for param value

  // remove quoting from param name, if it exists
  if (
    (paramName.startsWith('"') && paramName.endsWith('"')) ||
    (paramName.startsWith("'") && paramName.endsWith("'"))
  ) {
    paramName = paramName.substring(1, paramName.length - 1);
  }

  // validate paramName - must be at least len(1), start with letter, and only contain letters,
  // numbers, and _
  const regex = /^[A-Za-z][A-Za-z0-9_]*$/;
  if (!regex.exec(paramName)) {
    return false;
  }

  return true;
};

// objectHasKeyStartingWith checks if the specified object has any key beginning with the
// secified string
export const objectHasKeyStartingWith = (
  obj: object,
  keyStartsWith: string
): boolean => {
  // filter to any keys that match the starts with string
  const matchingKeys = Object.keys(obj).filter((key) =>
    key.startsWith(keyStartsWith)
  );

  // if any matches, true, else false
  return matchingKeys.length > 0;
};
