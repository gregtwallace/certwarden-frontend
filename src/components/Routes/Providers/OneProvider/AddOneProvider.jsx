import { useState } from 'react';

import InputSelect from '../../../UI/FormMui/InputSelect';
import FormContainer from '../../../UI/FormMui/FormContainer';
import TitleBar from '../../../UI/TitleBar/TitleBar';

import Http01InternalAdd from './Add/Http01InternalAdd';

// provider types maps known types to their components
const providerTypes = [
  {
    value: 'http01internal',
    name: 'HTTP-01 Internal Server',
    component: Http01InternalAdd,
  },
];

// empty component to use if form component is undefined
const DummyComponent = () => <></>;

const AddOneProvider = () => {
  const [providerType, setProviderType] = useState('');

  // data change handlers
  // string form field updates
  const changeProviderTypeHandler = (event) => {
    setProviderType(event.target.value);
  };

  // child form component
  var ProviderFormComponent = providerTypes.find((obj) => {
    return obj.value === providerType;
  })?.component;

  // prevent undefined error
  if (ProviderFormComponent == undefined) {
    ProviderFormComponent = DummyComponent;
  }

  return (
    <FormContainer>
      <TitleBar title='New Challenge Provider' />

      <InputSelect
        label='Provider Type'
        id='provider_type'
        options={providerTypes}
        value={providerType}
        onChange={changeProviderTypeHandler}
      />

      <ProviderFormComponent />
    </FormContainer>
  );
};

export default AddOneProvider;
