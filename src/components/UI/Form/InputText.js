const InputText = (props) => {
  let errorMessage = '';
  switch (props.name) {
    case 'name':
      errorMessage =
        'The name cannot be blank and must only contain these symbols - _ . ~ letters and numbers.';
      break;
    default:
      errorMessage = 'This field has an error.';
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
      {props.invalid && <div className='text-danger'>{errorMessage}</div>}
    </div>
  );
};

export default InputText;
