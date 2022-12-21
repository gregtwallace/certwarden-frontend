import { Button } from '@mui/material';

const FormButton = (props) => {
  var color = '';

  switch (props.type) {
    case 'submit':
      color = 'primary';
      break;
    case 'delete':
      color = 'error';
      break;
    case 'reset':
      color = 'info';
      break;
    case 'cancel':
      color = 'secondary';
      break;

    default:
      color = 'primary';
      break;
  }

  return (
    <Button
      type={props.type}
      variant='contained'
      onClick={props.onClick}
      disabled={props.disabled}
      sx={{
        ml: 2,
      }}
      color={color}
    >
      {props.children}
    </Button>
  );
};

export default FormButton;
