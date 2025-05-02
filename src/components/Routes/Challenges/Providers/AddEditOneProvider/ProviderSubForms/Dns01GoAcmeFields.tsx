import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputArrayText from '../../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../../UI/FormMui/InputTextField';

const Dns01GoAcmeFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'dns_provider_name' in formState.configToSubmit &&
      'environment' in formState.configToSubmit ? (
        <>
          <InputTextField
            id='configToSubmit.dns_provider_name'
            label='Provider&apos;s "CLI flag name" or "Code"'
            value={formState.configToSubmit.dns_provider_name}
            onChange={onChange}
            error={
              formState.validationErrors[
                'configToSubmit.dns_provider_name'
              ]
            }
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
        <SubFormError providerType='Dns01GoAcme' />
      )}
    </>
  );
};

export default Dns01GoAcmeFields;
