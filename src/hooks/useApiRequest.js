import { useEffect, useState } from "react";

// Hook to query the API and return a state based on the query
//    [expectedJsonName] is the json data from the expectedJsonName, named as expected
//    [origJsonDataName] is the json data from the expectedJsonName, and is not expected to be changed
//      This is to provide access to the data originally returned by the API, even if the state has been
//      subsequently updated.  Intention is to avoid subsequent API calls if not needed.
//    errorMessage is a string that is null if no error or a string containing the error if an error occurred
//    isLoaded is a bool that indicates if the api fetch has completed (either successfully or failed)
const useApiRequest = (apiNode, expectedJsonName) => {
  // make a variable for original api fetch for things like 'reset' function
  const origJsonDataName = "orig_" + expectedJsonName;

  const [state, setState] = useState({
    [expectedJsonName]: [],
    [origJsonDataName]: [],
    errorMessage: null,
    isLoaded: false,
  });

  useEffect(() => {
    setState({
      [expectedJsonName]: [],
      [origJsonDataName]: [],
      errorMessage: null,
      isLoaded: false,
    });
    
    fetch(`${process.env.REACT_APP_API_NODE}/api${apiNode}`)
      .then((response) => response.json())
      .then((json) => {
        if (!json[expectedJsonName]) {
          // add unknown error if the API didn't return the expected error json
          if (!json.error) {
            json.error = {message: "unknown error"}
          };
          // set error state
          setState({
            [expectedJsonName]: [],
            [origJsonDataName]: [],
            errorMessage: json.error.message,
            isLoaded: true,
          });
        // things worked, return json data from our expected name
        } else {
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
          [expectedJsonName]: [],
          [origJsonDataName]: [],
          errorMessage: error.name + " " + error.message,
          isLoaded: true,
        });
      });
  }, [apiNode, expectedJsonName, origJsonDataName]);

  return [ state, setState ];
};

export default useApiRequest;
