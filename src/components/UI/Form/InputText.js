const InputText = (props) => {
  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type='text'
        className='form-control'
        id={props.id}
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default InputText;
