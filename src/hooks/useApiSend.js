import { useState } from 'react';

const useApiSend = () => {
  const [state, setState] = useState({
    isSending: false,
    errorMessage: null,
  });

  // Send data to the node using the specified method and a payload from the specified event
  // return true if success and no error, return false if something goes wrong
  const sendData = async (apiNode, method, event = '') => {
    setState({
      isSending: true,
      errorMessage: null,
    });

    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());

    const requestOptions = {
      method: method,
      body: JSON.stringify(payload),
    };

    // for troubleshooting - TODO: Comment out
    console.log(requestOptions.body);

    try {
      let response = await fetch(
        `${process.env.REACT_APP_API_NODE}/api${apiNode}`,
        requestOptions
      );

      let errorMessage, responseJson
      try {
        responseJson = await response.json();
        if (responseJson.error) {
          errorMessage = responseJson.error.message
        }
      } catch(err) {
        errorMessage = "no json returned"
      }
      
      // check for response errors
      if (
        response.ok !== true ||
        response.status !== 200 ||
        errorMessage !== undefined
      ) {
        throw new Error(
          `Status: ${response.status}, Message: ${errorMessage}`
        );
      }

      setState({
        isSending: false,
        errorMessage: null,
      });
      return true;

    } catch (error) {
      setState({
        isSending: false,
        errorMessage: error.toString(),
      });
      return false;
    }
  };

  return [state, sendData];
};

export default useApiSend;
