import React from 'react';
import { useParams } from 'react-router-dom';

const ACMEAccounts = () => {
  const { id } = useParams();

  return (
    <>
      <h2>ACME Accounts Placeholder</h2>
      <h3>Account id: {id}</h3>
    </>
  );
};

export default ACMEAccounts;
