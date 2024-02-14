import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputArrayText from '../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01ManualFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'environment' in formState.dataToSubmit.config &&
      'create_script' in formState.dataToSubmit.config &&
      'delete_script' in formState.dataToSubmit.config ? (
        <>
          <InputArrayText
            id='dataToSubmit.config.environment'
            label='Environment Variables'
            subLabel='Variable'
            value={formState.dataToSubmit.config.environment}
            onChange={onChange}
          />

          <InputTextField
            id='dataToSubmit.config.create_script'
            label='Path to DNS Record Create Script'
            value={formState.dataToSubmit.config.create_script}
            onChange={onChange}
            error={
              formState.validationErrors['dataToSubmit.config.create_script']
            }
          />

          <InputTextField
            id='dataToSubmit.config.delete_script'
            label='Path to DNS Record Delete Script'
            value={formState.dataToSubmit.config.delete_script}
            onChange={onChange}
            error={
              formState.validationErrors['dataToSubmit.config.delete_script']
            }
          />
        </>
      ) : (
        <SubFormError providerType='Dns01ManualScript' />
      )}
    </>
  );
};

export default Dns01ManualFormFields;
