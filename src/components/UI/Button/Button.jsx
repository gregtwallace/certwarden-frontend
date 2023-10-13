import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Button as ButtonMui } from '@mui/material';

const Button = (props) => {
  const { disabled, children, href, onClick, size, sx, target, type } = props;

  var color = undefined;
  switch (type) {
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
    case 'revoke':
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
      component={href ? Link : null}
      to={href}
      target={target}
      type={type}
      variant='contained'
      onClick={onClick}
      disabled={disabled}
      sx={{
        ...sx,
        ml: 2,
      }}
      color={color}
      size={size}
    >
      {children}
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
  sx: PropTypes.object,
  children: PropTypes.node,
};

export default Button;
