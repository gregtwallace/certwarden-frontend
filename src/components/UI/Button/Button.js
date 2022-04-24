const Button = (props) => {
  var buttonClasses;

  switch (props.type) {
    case 'submit':
      buttonClasses = 'btn btn-primary mr-2';
      break;
    case 'reset':
      buttonClasses = 'btn btn-warning mr-2';
      break;
    case 'cancel':
      buttonClasses = 'btn btn-secondary mr-2';
      break;
    default:
        break;
  };

  buttonClasses = buttonClasses + " " + props.className;

  
  return (
    <button type='Submit' className={buttonClasses} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
