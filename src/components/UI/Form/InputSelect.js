const InputSelect = (props) => {
  let errorMessage = '';
  switch (props.name) {
    case 'algorithm':
      errorMessage =
        'Select an algorithm to generate a key.';
      break;
    default:
      errorMessage = 'This field has an error.';
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
        {props.emptyValue && (
          <option value='' disabled={props.disableEmptyValue && true}>
            {props.emptyValue}
          </option>
        )}
        {props.options.map((m) => (
          <option key={m.value} value={m.value}>
            {m.name}
          </option>
        ))}
      </select>
      {props.invalid && <div className='text-danger'>{errorMessage}</div>}
    </div>
  );
};

export default InputSelect;
