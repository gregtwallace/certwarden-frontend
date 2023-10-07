// formChangeHandlerFunc returns the input change handler specific
// to the setFormState func that is passed in
export const formChangeHandlerFunc = (setFormState) => {
  return (event, type) => {
    setFormState((prevState) => {
      // new val based on int or not
      var val = event.target.value;
      if (type === 'int') {
        val = parseInt(val);
      }

      // new form to set
      const newForm = {
        ...prevState.form,
        [event.target.name]: val,
      };

      return {
        ...prevState,
        form: newForm,
      };
    });
  };
};
