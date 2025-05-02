import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputTextField from '../../../../../UI/FormMui/InputTextField';

const Http01InternalFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'port' in formState.configToSubmit ? (
        <InputTextField
          id='configToSubmit.port'
          label='HTTP Server Port Number'
          value={formState.configToSubmit.port}
          onChange={onChange}
          error={formState.validationErrors['configToSubmit.port']}
        />
      ) : (
        <SubFormError providerType='Http01Internal' />
      )}
    </>
  );
};

export default Http01InternalFormFields;
