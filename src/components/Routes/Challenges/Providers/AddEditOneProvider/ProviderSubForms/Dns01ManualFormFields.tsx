import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputArrayText from '../../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../../UI/FormMui/InputTextField';

const Dns01ManualFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'environment' in formState.configToSubmit &&
      'create_script' in formState.configToSubmit &&
      'delete_script' in formState.configToSubmit ? (
        <>
          <InputArrayText
            id='configToSubmit.environment'
            label='Environment Variables'
            subLabel='Variable'
            value={formState.configToSubmit.environment}
            onChange={onChange}
            validationErrors={formState.validationErrors}
          />

          <InputTextField
            id='configToSubmit.create_script'
            label='Path to DNS Record Create Script'
            value={formState.configToSubmit.create_script}
            onChange={onChange}
            error={
              formState.validationErrors['configToSubmit.create_script']
            }
          />

          <InputTextField
            id='configToSubmit.delete_script'
            label='Path to DNS Record Delete Script'
            value={formState.configToSubmit.delete_script}
            onChange={onChange}
            error={
              formState.validationErrors['configToSubmit.delete_script']
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
