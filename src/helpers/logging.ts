// object keys containing any of the strings in this array will
// have their value redacted when passed through the redact function
const redactObjectKeysContaining = [
  'password',
  'api_key',
  'api_token',
  'hmac_key',
  'pem',
  'environment',
  'post_processing_client_key',
];

// redactJSONObject redacts any keys in the object containing strings
// in the list of keys to redact. this is intended to stop console log
// of things like passwords
export const redactJSONObject = (
  object: object | undefined,
): object | undefined => {
  // if undefined, return undefined
  if (!object) {
    return undefined;
  }

  // redact any keys containing words in the redaction array
  // easiest way is to stringify and then parse
  const redactedJSONString = JSON.stringify(object, (key, val: unknown) => {
    // should we even consider redaction? if key doesn't contain one of the values
    // we're concerned about, don't redact
    const keyIsInRedactList = redactObjectKeysContaining.some((innerVal) => {
      return key.includes(innerVal);
    });
    if (!keyIsInRedactList) {
      return val;
    }

    // its a non-empty string, redact it
    if (typeof val === 'string' && val.length > 0) {
      return '[redacted for log]';
    }

    // its an array, redact non-empty string elements
    if (Array.isArray(val)) {
      return Array.from(val, (elem) =>
        typeof elem === 'string' && elem.length > 0
          ? '[redacted for log]'
          : (elem as unknown),
      );
    }

    return val;
  });

  // turn back into object
  const obj: unknown = JSON.parse(redactedJSONString);
  if (obj === null || typeof obj !== 'object') {
    throw new Error('json parse failed unexpectedly');
  }

  return obj;
};
