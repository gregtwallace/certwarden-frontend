const InputSelect = (props) => {
  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <select
        className='form-control'
        value={props.value}
        id={props.id}
        onChange={props.onChange}
        readOnly={props.readOnly && true}
      >
        {props.options.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;
