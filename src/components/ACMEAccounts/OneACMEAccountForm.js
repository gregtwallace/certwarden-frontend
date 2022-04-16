//import { Link } from 'react-router-dom';

import InputText from '../UI/Form/InputText';

import Button from '../UI/Button/Button';
import InputSelect from '../UI/Form/InputSelect';
import InputCheckbox from '../UI/Form/InputCheckbox';

const OneACMEAccountForm = (props) => {
  const dummyKeys = {
    private_keys: [
      { id: 0, name: 'Key Name', email: 'some@name.com' },
      { id: 1, name: 'Some key name', email: 'greg@gtw86.com' },
      { id: 2, name: 'My key', email: 'temp@temp.net' },
    ],
  };
  const dummyCurrentKeyId = 1;

  // create options array to display in our dropdown for key selection
  const privateKeyOptions = dummyKeys.private_keys.map((m) => ({
    optionValue: m.id,
    optionName: m.name + ' (' + m.email + ')',
  }));

  return (
    <form>
      <InputText label='Account Name' id="name" value={props.acmeAccount.name} />
      <InputText label='E-Mail Address' id="email" value={props.acmeAccount.email} />
      <InputText label='Description' id="description" value={props.acmeAccount.description} />
      <InputSelect
        label='Private Key'
        id="privateKey"
        options={privateKeyOptions}
        defaultValue={dummyCurrentKeyId}
      />
      <InputCheckbox id="acceptTos">Accept Let's Encrypt Terms of Service</InputCheckbox>
      <InputCheckbox id="acceptTos">Staging Account</InputCheckbox>

      <Button type='submit'>Submit</Button>
      <Button type='reset'>Reset</Button>
      <Button type='cancel'>Cancel</Button>
    </form>
  );
};

export default OneACMEAccountForm;
