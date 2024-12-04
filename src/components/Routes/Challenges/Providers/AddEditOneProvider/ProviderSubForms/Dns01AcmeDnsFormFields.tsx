import { type FC } from 'react';
import { type providerSubFormPropsType } from '../../../../../../types/frontend';

import SubFormError from './SubFormError';
import InputArrayObjectsOfText from '../../../../../UI/FormMui/InputArrayObjectsOfText';
import InputTextField from '../../../../../UI/FormMui/InputTextField';

const Dns01AcmeDnsFormFields: FC<providerSubFormPropsType> = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      {'acme_dns_address' in formState.dataToSubmit.config &&
      'resources' in formState.dataToSubmit.config ? (
        <>
          <InputTextField
            id='dataToSubmit.config.acme_dns_address'
            label='ACME DNS Server Address'
            value={formState.dataToSubmit.config.acme_dns_address}
            onChange={onChange}
            error={
              formState.validationErrors['dataToSubmit.config.acme_dns_address']
            }
          />

          <InputArrayObjectsOfText
            id='dataToSubmit.config.resources'
            label='ACME DNS Resources'
            subLabel='ACME DNS Resource'
            minElements={1}
            newObject={{
              real_domain: '',
              full_domain: '',
              username: '',
              password: '',
            }}
            value={formState.dataToSubmit.config.resources}
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
