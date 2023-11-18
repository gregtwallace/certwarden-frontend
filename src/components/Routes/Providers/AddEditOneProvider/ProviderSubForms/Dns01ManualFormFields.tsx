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
      {'environment' in formState.dataToSubmit &&
      'create_script' in formState.dataToSubmit &&
      'delete_script' in formState.dataToSubmit ? (
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
            id='dataToSubmit.environment'
            label='Environment Variables'
            subLabel='Variable'
            value={formState.dataToSubmit.environment}
            onChange={onChange}
          />

          <FormInfo>
            Paths to scripts, including filename. May be relative to LeGo or
            absolute.
          </FormInfo>

          <InputTextField
            id='dataToSubmit.create_script'
            label='Path to DNS Record Create Script'
            value={formState.dataToSubmit.create_script}
            onChange={onChange}
            error={formState.validationErrors['dataToSubmit.create_script']}
          />

          <InputTextField
            id='dataToSubmit.delete_script'
            label='Path to DNS Record Delete Script'
            value={formState.dataToSubmit.delete_script}
            onChange={onChange}
            error={formState.validationErrors['dataToSubmit.delete_script']}
          />
        </>
      ) : (
        <SubFormError providerType='Dns01ManualScript' />
      )}
    </>
  );
};

export default Dns01ManualFormFields;
