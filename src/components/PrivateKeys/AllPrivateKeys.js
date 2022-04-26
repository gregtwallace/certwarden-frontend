import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ApiError from '../UI/ApiError/Error';

import Table from '../UI/Table/Table';
import TableBody from '../UI/Table/TableBody';
import TableData from '../UI/Table/TableData';
import TableHead from '../UI/Table/TableHead';
import TableHeader from '../UI/Table/TableHeader';
import TableRow from '../UI/Table/TableRow';

const AllPrivateKeys = () => {
  const [state, setState] = useState({
    jsonData: [],
    error: [],
    isLoaded: false,
  });

  useEffect(() => {
    setState({
      jsonData: [],
      error: null,
      isLoaded: false,
    });
    fetch(`${process.env.REACT_APP_API_NODE}/v1/privatekeys`)
      .then((response) => response.json())
      .then((json) => {
        if (!json.private_keys) {
          if (!json.error) {
            json.error = {message: "unknown error"}
          };
          setState({
            jsonData: null,
            error: json.error,
            isLoaded: true,
          });
        } else {
          setState({
            jsonData: json.private_keys,
            error: null,
            isLoaded: true,
          });
        }
      });
  }, []);

  if (!state.jsonData || state.error) {
    return <ApiError message={state.error.message} />;
  } else if (!state.isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <h2>Private Keys</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>Name</TableHeader>
              <TableHeader scope='col'>Description</TableHeader>
              <TableHeader scope='col'>Algorithm</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.jsonData.map((item) => (
              <TableRow key={item.id}>
                <TableHeader scope='row'>
                  <Link to={'/privatekeys/' + item.id}>{item.name}</Link>
                </TableHeader>
                <TableData>{item.description}</TableData>
                <TableData>{item.algorithm}</TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }
};

export default AllPrivateKeys;
