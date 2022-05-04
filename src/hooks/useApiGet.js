import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// function to convert unix time to something friendlier
const convertUnixTime = (unixTime) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(unixTime * 1000);
  // Note: *1000 due to millisecond conversion
};

// Hook to query the API and return a state based on the query
const useApiGet = (apiNode, expectedJsonName) => {
  const { id } = useParams();

  const [state, setState] = useState({
    [expectedJsonName]: {},
    isLoaded: false,
    errorMessage: null,
  });

  useEffect(() => {
    const fetchApi = async () => {
      setState({
        [expectedJsonName]: {},
        isLoaded: false,
        errorMessage: null,
      });

      // if there is an id, verify it is a valid integer or don't bother calling the API
      if (parseInt(id) >= 0 || !id) {
        try {
          let response = await fetch(
            `${process.env.REACT_APP_API_NODE}/api${apiNode}`
          );
          let responseJson = await response.json();

          if (
            response.ok !== true ||
            response.status !== 200 ||
            !responseJson[expectedJsonName] ||
            responseJson.error !== undefined
          ) {
            throw new Error(
              `Status: ${response.status}, Message: ${responseJson.error.message}`
            );
          }

          // If there are created or update timestamps, convert them from Unix to something friendly.
          if (responseJson[expectedJsonName].created_at) {
            responseJson[expectedJsonName].created_at = convertUnixTime(
              responseJson[expectedJsonName].created_at
            );
          }
          if (responseJson[expectedJsonName].updated_at) {
            responseJson[expectedJsonName].updated_at = convertUnixTime(
              responseJson[expectedJsonName].updated_at
            );
          }

          setState({
            [expectedJsonName]: responseJson[expectedJsonName],
            isLoaded: true,
            errorMessage: null,
          });
        } catch (error) {
          setState({
            [expectedJsonName]: {},
            isLoaded: true,
            errorMessage: error.toString(),
          });
        }
      } else {
        setState({
          [expectedJsonName]: {},
          isLoaded: true,
          errorMessage: 'Message: id is not valid',
        });
      }
    };

    fetchApi();
  }, [apiNode, expectedJsonName, id]);

  return state;
};

export default useApiGet;
