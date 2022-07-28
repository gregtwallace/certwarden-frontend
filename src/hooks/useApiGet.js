import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

// Hook to query the API and return a state based on the query
const useApiGet = (apiNode, expectedJsonName) => {
  const { id } = useParams();

  const [state, setState] = useState({
    [expectedJsonName]: {},
    isLoaded: false,
    errorMessage: null,
  });

  const updateGet = useCallback(async () => {
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
          !(expectedJsonName in responseJson) ||
          responseJson.error !== undefined
        ) {
          throw new Error(
            `Status: ${response.status}, Message: ${responseJson.error.message}`
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
  }, [id, apiNode, expectedJsonName]);

  useEffect(() => {
    updateGet();
  }, [updateGet]);

  return [state, updateGet];
};

export default useApiGet;
