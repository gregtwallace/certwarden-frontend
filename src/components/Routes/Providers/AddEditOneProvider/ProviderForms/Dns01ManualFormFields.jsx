import { PropTypes } from 'prop-types';

import { Typography } from '@mui/material';
import InputArrayText from '../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01ManualFormFields = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      <Typography variant='body2' sx={{ m: 2 }}>
        Format must be:
        <br />
        variable_name=variable_value
        <br />
        <br />
        For example: <br />
        my_api_key=abcdef12345
      </Typography>

      <InputArrayText
        id='form.environment'
        label='Environment Variables'
        subLabel='Variable'
        value={formState.form.environment}
        onChange={onChange}
      />

      <Typography variant='body2' sx={{ m: 2 }}>
        Paths to scripts, including filename. May be relative to LeGo or
        absolute.
      </Typography>

      <InputTextField
        id='form.create_script'
        label='Path to DNS Record Create Script'
        value={formState.form.create_script}
        onChange={onChange}
        error={formState.validationErrors.create_script}
      />

      <InputTextField
        id='form.delete_script'
        label='Path to DNS Record Delete Script'
        value={formState.form.delete_script}
        onChange={onChange}
        error={formState.validationErrors.delete_script}
      />
    </>
  );
};

Dns01ManualFormFields.propTypes = {
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dns01ManualFormFields;
