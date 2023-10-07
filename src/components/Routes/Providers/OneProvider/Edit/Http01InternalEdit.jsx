import { useEffect } from 'react';
import PropTypes from 'prop-types';

import InputTextArray from '../../../../UI/FormMui/InputTextArray';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Http01InternalEdit = (props) => {
  // destructure props
  const { apiGetState, formState, setFormState } = props;

  // set form fields on load
  useEffect(() => {
    const initialForm = {
      domains: apiGetState.provider.config.domains,
      port: apiGetState.provider.config.port,
    };

    setFormState({
      form: initialForm,
      formOriginal: initialForm,
      changed: false,
      validationErrors: {},
    });
  }, [apiGetState, setFormState]);

  // data change handler
  const inputChangeHandler = (event, isInt) => {
    setFormState((prevState) => {
      // new val based on int or not
      var val = event.target.value;
      if (isInt) {
        val = parseInt(val);
      }

      // new form to set
      const newForm = {
        ...prevState.form,
        [event.target.name]: val,
      };

      // does new form === original form
      const changedForm =
        JSON.stringify(prevState.formOriginal) !== JSON.stringify(newForm);

      return {
        ...prevState,
        changed: changedForm,
        form: newForm,
      };
    });
  };

  // only render form fields after state has the form loaded
  const renderFormFields = JSON.stringify({}) !== JSON.stringify(formState);

  return (
    <>
      {renderFormFields && (
        <>
          <InputTextArray
            label='Domains'
            subLabel='Domain'
            id='domains'
            name='domains'
            minElems={1}
            value={formState.form.domains}
            onChange={(e) => inputChangeHandler(e, false)}
            error={formState.validationErrors.domains && true}
          />

          <InputTextField
            label='HTTP Server Port Number'
            id='port'
            value={formState.form.port}
            onChange={(e) => inputChangeHandler(e, true)}
            error={formState.validationErrors.port && true}
          />
        </>
      )}
    </>
  );
};

// define props for linter
Http01InternalEdit.propTypes = {
  apiGetState: PropTypes.shape({
    provider: PropTypes.shape({
      config: PropTypes.shape({
        domains: PropTypes.arrayOf(PropTypes.string).isRequired,
        port: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  formState: PropTypes.shape({
    form: PropTypes.shape({
      domains: PropTypes.arrayOf(PropTypes.string).isRequired,
      port: PropTypes.number.isRequired,
    }),
    validationErrors: PropTypes.objectOf(PropTypes.bool),
  }).isRequired,
  setFormState: PropTypes.func.isRequired,
};

export default Http01InternalEdit;
