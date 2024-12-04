import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputArrayText from '../../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../../UI/FormMui/InputTextField';

const Dns01GoAcmeFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'dns_provider_name' in formState.dataToSubmit.config &&
      'environment' in formState.dataToSubmit.config ? (
        <>
          <InputTextField
            id='dataToSubmit.config.dns_provider_name'
            label='Provider&apos;s "CLI flag name" or "Code"'
            value={formState.dataToSubmit.config.dns_provider_name}
            onChange={onChange}
            error={
              formState.validationErrors[
                'dataToSubmit.config.dns_provider_name'
              ]
            }
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
        <SubFormError providerType='Dns01GoAcme' />
      )}
    </>
  );
};

export default Dns01GoAcmeFields;
