import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Table from '../UI/Table/Table';
import TableBody from '../UI/Table/TableBody';
import TableData from '../UI/Table/TableData';
import TableHead from '../UI/Table/TableHead';
import TableHeader from '../UI/Table/TableHeader';
import TableRow from '../UI/Table/TableRow';

const AllACMEAccounts = () => {
  
  const [acmeAccounts, setAcmeAccounts] = useState({
    accounts: [],
    isLoaded: false
  });

  useEffect(() => {
    fetch("http://localhost:4050/api/v1/acmeaccounts")
    .then((response) => response.json())
    .then((json) => {
      setAcmeAccounts({
        accounts: json.acme_accounts,
        isLoaded: true,
      });
    });
  }, []);

  if (!acmeAccounts.isLoaded) {
    return <p>Loading...</p>
  };

  return (
    <>
      <h2>ACME Accounts</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader scope='col'>Name</TableHeader>
            <TableHeader scope='col'>E-Mail</TableHeader>
            <TableHeader scope='col'>Description</TableHeader>
            <TableHeader scope='col'>Key</TableHeader>
            <TableHeader scope='col'>Type</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {acmeAccounts.accounts.map((m) => (
            <TableRow key={m.id}>
              <TableHeader scope='row'><Link to={"/acmeaccounts/" + m.id}>{m.name}</Link></TableHeader>
              <TableData>{m.email}</TableData>
              <TableData>{m.description}</TableData>
              <TableData>{m.private_key_name}</TableData>
              <TableData>{m.is_staging ? "Staging" : "Production"}</TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AllACMEAccounts;
