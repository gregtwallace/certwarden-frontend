// object keys containing any of the strings in this array will
// have their value redacted when passed through the redact function
const redactObjectKeysContaining = [
  'password',
  'api_key',
  'api_token',
  'hmac_key',
  'pem',
  'environment',
];

// redactJSONObject redacts any keys in the object containing strings
// in the list of keys to redact. this is intended to stop console log
// of things like passwords
export const redactJSONObject = (object) => {
  // redact any keys containing words in the redaction array
  // easiest way is to stringify and then parse
  const redactedJSONString = JSON.stringify(object, (key, val) => {
    // search for any of the strings in the array
    const redactVal = redactObjectKeysContaining.some((str) =>
      key.includes(str)
    );

    return redactVal ? '[redacted for log]' : val;
  });

  // turn back into object
  return JSON.parse(redactedJSONString);
};
