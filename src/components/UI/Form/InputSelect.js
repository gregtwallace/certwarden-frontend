const InputSelect = (props) => {
  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <select className='form-control' value={props.value} id={props.id} onChange={props.onChange}>
        {props.options.map((m) => (
          <option key={m.optionValue} value={m.optionValue}>
            {m.optionName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;
