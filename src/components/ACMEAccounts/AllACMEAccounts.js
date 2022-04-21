import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AllACMEAccounts = () => {
  
  const [acmeAccounts, setAcmeAccounts] = useState({
    accounts: [],
    isLoaded: false
  });

  useEffect(() => {
    fetch("http://localhost:4050/v1/acmeaccounts")
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
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>E-Mail</th>
            <th scope='col'>Description</th>
            <th scope='col'>Key</th>
            <th scope='col'>Type</th>
          </tr>
        </thead>
        <tbody>
          {acmeAccounts.accounts.map((m) => (
            <tr key={m.id}>
              <th scope='row'><Link to={"/acmeaccounts/" + m.id}>{m.name}</Link></th>
              <td>{m.email}</td>
              <td>{m.description}</td>
              <td>{m.private_key_name}</td>
              <td>{m.is_staging ? "Staging" : "Production"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AllACMEAccounts;
