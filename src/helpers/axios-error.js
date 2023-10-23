import { redactJSONObject } from './logging';

export const parseAxiosError = (err, showDebugInfo = false) => {
  // log if showDebugInfo
  if (showDebugInfo) {
    // try to parse config.data to an object for better logging and redaction
    try {
      err.config.data = JSON.parse(err.config.data);
    } catch {
      // ignore failed to parse, leave as-is
    }
    console.log(redactJSONObject(err));
  }

  // default error return (if fail to get more from axios response)
  let errorCode = err.code;
  let errorMessage = err.message;

  // try to set response error code
  try {
    errorCode = err.response.status;
  } catch {
    // leave default
  }

  // try to set response error message
  try {
    errorMessage = err.response.data.error.message;
  } catch (err) {
    // leave default
  }

  return [errorCode, errorMessage];
};
