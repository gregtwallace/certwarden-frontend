const Button = (props) => {
  var buttonClasses = 'btn mr-2';

  switch (props.type) {
    case 'primary':
    case 'submit':
      buttonClasses += ' btn-primary';
      break;
    case 'cancel':
    case 'back':
      buttonClasses += ' btn-secondary';
      break;
    case 'reset':
    case 'deactivate':
    case 'edit':
      buttonClasses += ' btn-warning';
      break;
    case 'delete':
      buttonClasses += ' btn-danger';
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
