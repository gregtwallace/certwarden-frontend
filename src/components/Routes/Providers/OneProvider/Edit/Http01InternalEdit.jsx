import { PropTypes } from 'prop-types';

import InputTextArray from '../../../../UI/FormMui/InputTextArray';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Http01InternalEdit = (props) => {
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
        onChange={(e) => onChange(e, false)}
        error={formState.validationErrors.domains && true}
      />

      <InputTextField
        label='HTTP Server Port Number'
        id='port'
        value={formState.form.port}
        onChange={(e) => onChange(e, true)}
        error={formState.validationErrors.port && true}
      />
    </>
  );
};

// define props for linter
Http01InternalEdit.propTypes = {
  formState: PropTypes.shape({
    form: PropTypes.shape({
      domains: PropTypes.arrayOf(PropTypes.string).isRequired,
      port: PropTypes.number.isRequired,
    }).isRequired,
    validationErrors: PropTypes.objectOf(PropTypes.bool),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Http01InternalEdit;
