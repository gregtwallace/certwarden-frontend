const InputHidden = (props) => {
  return (
    <input
      type='hidden'
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      readOnly={props.readOnly && true}
      disabled={props.disabled && true}
    />
  );
};

export default InputHidden;
