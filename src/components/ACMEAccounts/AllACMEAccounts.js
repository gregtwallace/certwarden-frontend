import { useState } from 'react';
import { Link } from 'react-router-dom';

const AllACMEAccounts = () => {
  
  // TO-DO: Integrate with API
  const dummyAccounts = {
    acme_accounts: [
      {
        id: 0,
        key_id: 0,
        name: 'Primary for Pub Domain',
        email: 'greg@gregtwallace.com',
        description: 'Main account',
        is_staging: false,
      },
      {
        id: 1,
        key_id: 10,
        name: 'Another Acct',
        email: 'something@test.com',
        description: 'Staging 1',
        is_staging: true,
      },
      {
        id: 2,
        key_id: 4,
        name: 'Account #3',
        email: 'another@fake.com',
        description: 'Staging Backup',
        is_staging: true,
      },
      {
        id: 3,
        key_id: 7,
        name: 'Primary gtw86.com',
        email: 'greg@gtw86.com',
        description: 'For LAN',
        is_staging: false,
      },
    ],
  };

  const [acmeAccounts, setAcmeAccounts] = useState(dummyAccounts);

  console.log(acmeAccounts);

  // TO-DO: Change 'm.key_id' to return actual key info
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
          {acmeAccounts.acme_accounts.map((m) => (
            <tr key={m.id}>
              <th scope='row'><Link to={"/acmeaccounts/" + m.id}>{m.name}</Link></th>
              <td>{m.email}</td>
              <td>{m.description}</td>
              <td>{m.key_id}</td>
              <td>{m.is_staging ? "Staging" : "Production"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AllACMEAccounts;
