import FormError from './FormError';

const InputCheckbox = (props) => {
  let errorMessage = '';
  switch (props.id) {
    case 'accepted_tos':
      errorMessage = 'You must accept the terms of service.';
      break;
    default:
      errorMessage = 'This field has an error.';
      break;
  }

  return (
    <div className='form-group'>
      <div className='form-check'>
        <input
          className='form-check-input'
          type='checkbox'
          name={props.name}
          id={props.id}
          onChange={props.onChange}
          checked={props.checked && true}
          readOnly={props.readOnly && true}
          disabled={props.disabled && true}
        />
        <label className='form-check-label' htmlFor={props.id}>
          {props.children}
        </label>
      </div>
      {props.invalid && <FormError>{errorMessage}</FormError>}
    </div>
  );
};

export default InputCheckbox;
