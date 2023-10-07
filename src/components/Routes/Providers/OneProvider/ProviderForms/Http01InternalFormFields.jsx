import { PropTypes } from 'prop-types';

import InputTextArray from '../../../../UI/FormMui/InputTextArray';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Http01InternalFormFields = (props) => {
  // destructure props
  const { formState, onChange } = props;

  return (
    <>
      <InputTextArray
        label='Domains'
        subLabel='Domain'
        id='domains'
        name='domains'
        minElems={1}
        value={formState.form.domains}
        onChange={onChange}
        error={formState.validationErrors.domains}
      />

      <InputTextField
        label='HTTP Server Port Number'
        id='port'
        value={formState.form.port}
        onChange={(e) => onChange(e, 'int')}
        error={formState.validationErrors.port && true}
      />
    </>
  );
};

// define props for linter
Http01InternalFormFields.propTypes = {
  formState: PropTypes.shape({
    form: PropTypes.shape({
      domains: PropTypes.arrayOf(PropTypes.string).isRequired,
      port: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    }).isRequired,
    validationErrors: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.number)])
    ).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Http01InternalFormFields;
