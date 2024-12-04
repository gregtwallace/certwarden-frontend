import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputArrayText from '../../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../../UI/FormMui/InputTextField';

const Dns01AcmeShFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'acme_sh_path' in formState.dataToSubmit.config &&
      'dns_hook' in formState.dataToSubmit.config &&
      'environment' in formState.dataToSubmit.config ? (
        <>
          <InputTextField
            id='dataToSubmit.config.acme_sh_path'
            label='Path to acme.sh Install'
            value={formState.dataToSubmit.config.acme_sh_path}
            onChange={onChange}
            error={
              formState.validationErrors['dataToSubmit.config.acme_sh_path']
            }
          />

          <InputTextField
            id='dataToSubmit.config.dns_hook'
            label='DNS Hook Name'
            value={formState.dataToSubmit.config.dns_hook}
            onChange={onChange}
            error={formState.validationErrors['dataToSubmit.config.dns_hook']}
          />

          <InputArrayText
            id='dataToSubmit.config.environment'
            label='Environment Variables'
            subLabel='Variable'
            value={formState.dataToSubmit.config.environment}
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
