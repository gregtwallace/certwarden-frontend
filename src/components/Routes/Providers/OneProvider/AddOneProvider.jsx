import { useState } from 'react';

import { providerTypes } from './provider-types';

import InputSelect from '../../../UI/FormMui/InputSelect';
import FormContainer from '../../../UI/FormMui/FormContainer';
import TitleBar from '../../../UI/TitleBar/TitleBar';

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
  })?.addComponent;

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
