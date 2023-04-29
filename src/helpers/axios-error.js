export const parseAxiosError = async (err, devMode = false) => {
  // dev log error
  if (devMode) {
    console.log(err);
  }

  // check for status code and message
  let errorCode = 'none';
  let errorMessage;
  if (err?.response?.status) {
    errorCode = err.response.status;

    // try to append an error message, if present
    try {
      // if response data doesn't have an error text object (e.g. a blob), try to make it text
      if (!err.response.data.error) {
        let errorDataText = await err.response.data.text();
        let jsonError = JSON.parse(errorDataText);

        // update the data with the new json data
        err.response.data = jsonError;
      }

      errorMessage = err.response.data.error.message;
    } catch (errorInner) {
      // log inner error if in devmode
      if (devMode) {
        console.log(errorInner);
      }
    }
  } else {
    // if no status code, use message only
    errorMessage = err.message;
  }

  return [errorCode, errorMessage];
};
