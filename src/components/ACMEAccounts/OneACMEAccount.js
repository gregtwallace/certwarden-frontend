import { useState, React } from 'react';
import { useParams } from 'react-router-dom';

import OneACMEAccountForm from './OneACMEAccountForm';

const OneACMEAccount = () => {
  const { id } = useParams();

  const dummyAccount = {
    acme_account: {
      id: id,
      private_key_id: 0,
      name: 'Primary for Pub Domain',
      email: 'greg@gregtwallace.com',
      description: 'Main account',
      is_staging: false,
    },
  };

  const [acmeAccount, setAcmeAccount] = useState(dummyAccount.acme_account);

  return (
    <>
      <h2>ACME Account - Edit</h2>
      <h3>id: {acmeAccount.id} (TO-DO: Remove)</h3>
      <OneACMEAccountForm acmeAccount={acmeAccount} />
    </>
  );
};

export default OneACMEAccount;
