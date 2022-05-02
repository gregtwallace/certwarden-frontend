const InputTextArea = (props) => {
  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <textarea
        className='form-control'
        id={props.id}
        name={props.name}
        value={props.value}
        rows={props.rows}
        onChange={props.onChange}
        readOnly={props.readOnly && true}
        disabled={props.disabled && true}
      ></textarea>
    </div>
  );
};

export default InputTextArea;
