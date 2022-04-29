import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Hook to query the API and return a state based on the query
const useApiRequest = (apiNode, expectedJsonName) => {
  // make a variable for original api fetch for things like 'reset' function
  const origJsonDataName = 'orig_' + expectedJsonName;

  const { id } = useParams();

  const [state, setState] = useState({
    [expectedJsonName]: {},
    [origJsonDataName]: {},
    errorMessage: null,
    isLoaded: false,
  });

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

  useEffect(() => {
    setState({
      [expectedJsonName]: {},
      [origJsonDataName]: {},
      errorMessage: null,
      isLoaded: false,
    });

    // use -1 as a signifier we want to add a new item
    if (parseInt(id) === -1) {
      setState({
        [expectedJsonName]: {},
        [origJsonDataName]: {},
        errorMessage: null,
        isLoaded: true,
      });
    } else if (parseInt(id) >= 0 || !id) {
      // if there is an id, verify it is a valid integer or don't bother calling the API
      fetch(`${process.env.REACT_APP_API_NODE}/api${apiNode}`)
        .then((response) => response.json())
        .then((json) => {
          if (!json[expectedJsonName] || json.error) {
            // add unknown error if the API didn't return the expected error json
            if (!json.error) {
              json.error = { message: 'unexpected json without error message' };
            }
            // set error state
            setState({
              [expectedJsonName]: {},
              [origJsonDataName]: {},
              errorMessage: json.error.message,
              isLoaded: true,
            });
          }
          // things worked, return json data from our expected name
          else {
            // If there are created or update timestamps, convert them from Unix to something friendly.
            if (json[expectedJsonName].created_at) {
              json[expectedJsonName].created_at = convertUnixTime(
                json[expectedJsonName].created_at
              );
            }
            if (json[expectedJsonName].updated_at) {
              json[expectedJsonName].updated_at = convertUnixTime(
                json[expectedJsonName].updated_at
              );
            }

            setState({
              [expectedJsonName]: json[expectedJsonName],
              [origJsonDataName]: json[expectedJsonName],
              errorMessage: null,
              isLoaded: true,
            });
          }
        })
        .catch((error) => {
          setState({
            [expectedJsonName]: {},
            [origJsonDataName]: {},
            errorMessage: error.name + ' ' + error.message,
            isLoaded: true,
          });
        });
    } else {
      setState({
        [expectedJsonName]: {},
        [origJsonDataName]: {},
        errorMessage: 'id is not valid',
        isLoaded: true,
      });
    }
  }, [apiNode, expectedJsonName, origJsonDataName, id]);

  return [state, setState];
};

export default useApiRequest;
