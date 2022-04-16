const InputCheckbox = (props) => {
  return (
    <div className='form-group form-check'>
      <input
        className='form-check-input'
        type='checkbox'
        name={props.id}
        id={props.id}
      />
      <label className='form-check-label' htmlFor={props.id}>
        {props.children}
      </label>
    </div>
  );
};

export default InputCheckbox;
