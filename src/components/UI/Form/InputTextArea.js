import FormError from "./FormError";

const InputTextArea = (props) => {
  let errorMessage = '';
  switch (props.name) {
    case 'pem':
      errorMessage = 'PEM content is not valid.'
      break;
    default:
      errorMessage = 'This field has an error.';
      break;
  }

  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <textarea
        className={`form-control ${props.invalid && 'is-invalid'}`}
        id={props.id}
        name={props.name}
        value={props.value}
        rows={props.rows}
        onChange={props.onChange}
        readOnly={props.readOnly && true}
        disabled={props.disabled && true}
      ></textarea>
      {props.invalid && <FormError>{errorMessage}</FormError>}
    </div>
  );
};

export default InputTextArea;
