const FormInformation = (props) => {
  return (
    <div className='form-group'>
      <label>{props.children}</label>
    </div>
  );
};


export default FormInformation;