const InputSelect = (props) => {
  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <select
        className='form-control'
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
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
    </div>
  );
};

export default InputSelect;
