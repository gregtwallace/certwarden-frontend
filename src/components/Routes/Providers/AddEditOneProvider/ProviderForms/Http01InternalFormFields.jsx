import { PropTypes } from 'prop-types';

import InputTextField from '../../../../UI/FormMui/InputTextField';

const Http01InternalFormFields = (props) => {
  const { formState, onChange } = props;

  return (
    <InputTextField
      id='form.port'
      label='HTTP Server Port Number'
      value={formState.form.port}
      onChange={onChange}
      error={formState.validationErrors.port}
    />
  );
};

Http01InternalFormFields.propTypes = {
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Http01InternalFormFields;
