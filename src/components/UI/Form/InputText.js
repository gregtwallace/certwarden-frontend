import FormError from "./FormError";

const InputText = (props) => {
  let errorMessage = '';
  switch (props.id) {
    case 'name':
      errorMessage =
        'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.';
      break;
    case 'email':
      errorMessage =
        'Email address must be in a valid format.';
      break;
    case 'subject':
    case props.id.match(/^subject_alts/)?.input:
      errorMessage = 
        'Subject must be a valid (sub)domain name.';
      break;
    default:
      errorMessage = 'This field has an error.';
      break;
  }

  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type='text'
        className={`form-control ${props.invalid && 'is-invalid'}`}
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        readOnly={props.readOnly && true}
        disabled={props.disabled && true}
      />
      {props.invalid && <FormError>{errorMessage}</FormError>}
    </div>
  );
};

export default InputText;
