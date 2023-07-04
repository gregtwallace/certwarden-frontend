import PropTypes from 'prop-types';
import { Button as ButtonMui } from '@mui/material';

const Button = (props) => {
  var color = '';

  switch (props.type) {
    case 'add':
      color = 'success';
      break;
    case 'submit':
      color = 'primary';
      break;
    case 'deactivate':
    case 'manually_edit':
      color = 'warning';
      break;
    case 'delete':
      color = 'error';
      break;
    case 'info':
    case 'reset':
      color = 'info';
      break;
    case 'secondary':
    case 'cancel':
      color = 'secondary';
      break;

    default:
      color = 'primary';
      break;
  }

  return (
    <ButtonMui
      type={props.type}
      variant='contained'
      onClick={props.onClick}
      disabled={props.disabled}
      sx={{
        ml: 2,
      }}
      color={color}
      size={props.size}
    >
      {props.children}
    </ButtonMui>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
