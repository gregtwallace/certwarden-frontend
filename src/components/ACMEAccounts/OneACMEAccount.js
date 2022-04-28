import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import InputText from '../UI/Form/InputText';
import InputSelect from '../UI/Form/InputSelect';
import InputCheckbox from '../UI/Form/InputCheckbox';
import FormInformation from '../UI/Form/FormInformation';

import Button from '../UI/Button/Button';
import Form from '../UI/Form/Form';

const OneACMEAccount = () => {
  //dummy stuff
  const dummyKeys = [
    { id: 0, name: 'Key Name' },
    { id: 1, name: 'Some key name' },
    { id: 2, name: 'My key' },
  ];
  // end dummy stuff

  const { id } = useParams();
  const [acmeAccount, setAcmeAccount] = useState({
    account: [],
    origAccount: [],
    isLoaded: false,
  });

  // form field updates
  const nameChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, name: event.target.value },
      };
    });
  };
  const emailChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, email: event.target.value },
      };
    });
  };
  const descriptionChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, description: event.target.value },
      };
    });
  };
  const privateKeyChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, private_key_id: event.target.value },
      };
    });
  };
  const tosChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, accepted_tos: event.target.checked },
      };
    });
  };
  const stagingChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, is_staging: event.target.checked },
      };
    });
  };

  // button handlers
  const resetClickHandler = (event) => {
    event.preventDefault();
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.origAccount },
      };
    });
  };

  // fetch info when id changes
  useEffect(() => {
    setAcmeAccount({
      account: [],
      origAccount: [],
      isLoaded: false,
    });
    fetch(`http://localhost:4050/api/v1/acmeaccounts/${id}`)
      .then((response) => response.json())
      .then((json) => {
        setAcmeAccount({
          account: json.acme_account,
          origAccount: json.acme_account,
          isLoaded: true,
        });
      });
  }, [id]);

  if (!acmeAccount.isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>ACME Account - Edit</h2>
      <Form>
        <InputText
          label='Account Name'
          id='name'
          value={acmeAccount.account.name}
          onChange={nameChangeHandler}
        />
        <InputText
          label='E-Mail Address'
          id='email'
          value={acmeAccount.account.email}
          onChange={emailChangeHandler}
        />
        <InputText
          label='Description'
          id='description'
          value={acmeAccount.account.description}
          onChange={descriptionChangeHandler}
        />
        <InputSelect
          label='Private Key'
          id='privateKey'
          options={dummyKeys}
          value={acmeAccount.account.private_key_id}
          onChange={privateKeyChangeHandler}
        />
        <InputCheckbox
          id='acceptTos'
          checked={acmeAccount.account.accepted_tos}
          onChange={tosChangeHandler}
        >
          Accept Let's Encrypt Terms of Service
        </InputCheckbox>
        <InputCheckbox
          id='isStaging'
          checked={acmeAccount.account.is_staging}
          onChange={stagingChangeHandler}
        >
          Staging Account
        </InputCheckbox>

        <FormInformation>
          <small>Created: {acmeAccount.account.created_at}</small>
        </FormInformation>
        <FormInformation>
          <small>Last Updated: {acmeAccount.account.updated_at}</small>
        </FormInformation>

        <Button type='submit'>Submit</Button>
        <Button type='reset' onClick={resetClickHandler}>
          Reset
        </Button>
        <Button type='cancel'>Cancel</Button>
      </Form>
    </>
  );
};

export default OneACMEAccount;
