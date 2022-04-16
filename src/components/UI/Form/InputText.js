const InputText = (props) => {
  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type='text'
        className='form-control'
        id={props.id}
        value={props.value}
      />
    </div>
  );
};

export default InputText;
