const Button = (props) => {
  var buttonClasses = 'btn mr-2';

  switch (props.type) {
    case 'submit':
      buttonClasses += ' btn-primary';
      break;
    case 'primary':
      buttonClasses += ' btn-primary';
      break;
    case 'reset':
      buttonClasses += ' btn-warning';
      break;
    case 'cancel':
      buttonClasses += ' btn-secondary';
      break;
    case 'delete':
      buttonClasses += ' btn-danger';
      break;
    case 'deactivate':
      buttonClasses += ' btn-warning';
      break;
    default:
      break;
  }

  buttonClasses = buttonClasses + ' ' + props.className;

  return (
    <button
      type={props.type}
      className={buttonClasses}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
