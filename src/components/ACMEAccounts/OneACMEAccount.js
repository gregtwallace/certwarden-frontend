import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import OneACMEAccountForm from './OneACMEAccountForm';

const OneACMEAccount = () => {
  const { id } = useParams();
  const [acmeAccount, setAcmeAccount] = useState({
    account: [],
    isLoaded: false,
  });

  useEffect(() => {
    fetch(`http://localhost:4050/v1/acmeaccount/${id}`)
    .then((response) => response.json())
    .then((json) => {
      setAcmeAccount({
        account: json.acme_account,
        isLoaded: true,
      });
    });
  }, []);

  if (!acmeAccount.isLoaded) {
    return <p>Loading...</p>
  };

  return (
    <>
      <h2>ACME Account - Edit</h2>
      <h3>id: {acmeAccount.account.id} (TO-DO: Remove)</h3>
      <OneACMEAccountForm acmeAccount={acmeAccount.account} />
    </>
  );
};

export default OneACMEAccount;
