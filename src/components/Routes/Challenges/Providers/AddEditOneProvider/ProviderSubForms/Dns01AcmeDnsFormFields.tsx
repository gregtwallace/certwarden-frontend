import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputArrayObjectsOfText from '../../../../../UI/FormMui/InputArrayObjectsOfText';
import InputTextField from '../../../../../UI/FormMui/InputTextField';

const Dns01AcmeDnsFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'acme_dns_address' in formState.configToSubmit &&
      'resources' in formState.configToSubmit ? (
        <>
          <InputTextField
            id='configToSubmit.acme_dns_address'
            label='ACME DNS Server Address'
            value={formState.configToSubmit.acme_dns_address}
            onChange={onChange}
            error={
              formState.validationErrors['configToSubmit.acme_dns_address']
            }
          />

          <InputArrayObjectsOfText
            id='configToSubmit.resources'
            label='ACME DNS Resources'
            subLabel='ACME DNS Resource'
            minElements={1}
            newObject={{
              real_domain: '',
              full_domain: '',
              username: '',
              password: '',
            }}
            value={formState.configToSubmit.resources}
            onChange={onChange}
            validationErrors={formState.validationErrors}
          />
        </>
      ) : (
        <SubFormError providerType='Dns01AcmeDns' />
      )}
    </>
  );
};

export default Dns01AcmeDnsFormFields;
