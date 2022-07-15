import FormError from "./FormError";

const InputSelect = (props) => {
  let errorMessage = '';
  switch (props.id) {
    case 'algorithm_value':
      errorMessage =
        'Select an algorithm to generate a key.';
      break;
    case 'private_key_id':
      errorMessage = 
        'Select an available private key.';
      break;
    default:
      errorMessage = 'This field has an error.';
      break;
  }

  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <select
        className={`form-control ${props.invalid && 'is-invalid'}`}
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        // doesn't really support readOnly
        disabled={props.disabled && true}
      >
        {props.defaultName && (
          <option value={props.defaultValue}>
            {props.defaultName}
          </option>
        )}
        {(!props.disabled && props.options) && props.options.map((m) => (
          <option key={m.value} value={m.value}>
            {m.name}
          </option>
        ))}
      </select>
      {props.invalid && <FormError>{errorMessage}</FormError>}
    </div>
  );
};

export default InputSelect;
