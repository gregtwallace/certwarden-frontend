import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../types/frontend';

import SubFormError from './SubFormError';
import FormInfo from '../../../../UI/FormMui/FormInfo';
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
          <FormInfo>
            Format must be:
            <br />
            variable_name=variable_value
            <br />
            <br />
            For example: <br />
            my_api_key=abcdef12345
          </FormInfo>

          <InputArrayText
            id='dataToSubmit.config.environment'
            label='Environment Variables'
            subLabel='Variable'
            value={formState.dataToSubmit.config.environment}
            onChange={onChange}
          />

          <FormInfo>
            Paths to scripts, including filename. May be relative to LeGo or
            absolute.
          </FormInfo>

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
