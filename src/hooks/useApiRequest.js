import { useEffect, useState } from "react";

// Hook to query the API and return a state based on the query
//    jsonData is the json data from the expectJsonName
//    errorMessage is a string if there was an error getting the expected data from the api
//    isLoaded is a bool that indicates if the api has sent data back yet
const useApiRequest = (apiNode, expectedJsonName) => {
  const [state, setState] = useState({
    jsonData: [],
    errorMessage: null,
    isLoaded: false,
  });

  useEffect(() => {
    setState({
      jsonData: [],
      errorMessage: null,
      isLoaded: false,
    });
    
    fetch(`${process.env.REACT_APP_API_NODE}${apiNode}`)
      .then((response) => response.json())
      .then((json) => {
        if (!json[expectedJsonName]) {
          // add unknown error if the API didn't return the expected error json
          if (!json.error) {
            json.error = {message: "unknown error"}
          };
          setState({
            jsonData: json.error,
            errorMessage: json.error.message,
            isLoaded: true,
          });
        } else {
          setState({
            jsonData: json[expectedJsonName],
            errorMessage: null,
            isLoaded: true,
          });
        }
      });
  }, [apiNode, expectedJsonName]);

  return state
};

export default useApiRequest;
