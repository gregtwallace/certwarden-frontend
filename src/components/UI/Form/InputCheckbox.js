import FormError from './FormError';
import InputHidden from './InputHidden';

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
    <>
      <div className='form-group'>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            id={props.id}
            onChange={props.onChange}
            checked={props.checked && true}
            disabled={props.disabled && true}
          />
          <label className='form-check-label' htmlFor={props.id}>
            {props.children}
          </label>
        </div>
        {props.invalid && <FormError>{errorMessage}</FormError>}
      </div>
      {/* Since checkbox doesn't send if off, use hidden field instead */}
      {!props.disabled && (
        <InputHidden
          id={props.id + '_hidden'}
          name={props.name}
          value={props.checked ? true : false}
        />
      )}
    </>
  );
};

export default InputCheckbox;
