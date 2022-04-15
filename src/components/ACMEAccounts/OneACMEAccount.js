import React from 'react';
import { useParams } from 'react-router-dom';

const OneACMEAccount = () => {
  const { id } = useParams();

  return (
    <>
      <h2>ACME Account</h2>
      <h3>Key ID: {id}</h3>
    </>
  );
};

export default OneACMEAccount;
