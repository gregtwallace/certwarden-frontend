import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
    case 'edit':
    case 'restart':
      color = 'warning';
      break;
    case 'delete':
    case 'shutdown':
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
      component={props.href ? Link : null}
      to={props.href}
      target={props.target}
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
  href: PropTypes.string,
  target: PropTypes.string,

  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
