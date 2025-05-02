import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputArrayText from '../../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../../UI/FormMui/InputTextField';

const Dns01AcmeShFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'acme_sh_path' in formState.configToSubmit &&
      'dns_hook' in formState.configToSubmit &&
      'environment' in formState.configToSubmit ? (
        <>
          <InputTextField
            id='configToSubmit.acme_sh_path'
            label='Path to acme.sh Install'
            value={formState.configToSubmit.acme_sh_path}
            onChange={onChange}
            error={
              formState.validationErrors['configToSubmit.acme_sh_path']
            }
          />

          <InputTextField
            id='configToSubmit.dns_hook'
            label='DNS Hook Name'
            value={formState.configToSubmit.dns_hook}
            onChange={onChange}
            error={formState.validationErrors['configToSubmit.dns_hook']}
          />

          <InputArrayText
            id='configToSubmit.environment'
            label='Environment Variables'
            subLabel='Variable'
            value={formState.configToSubmit.environment}
            onChange={onChange}
            validationErrors={formState.validationErrors}
          />
        </>
      ) : (
        <SubFormError providerType='Dns01AcmeSh' />
      )}
    </>
  );
};

export default Dns01AcmeShFormFields;
