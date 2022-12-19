import Alert from '@mui/material/Alert';

const FormError = (props) => {
  return <Alert severity="error">{props.children}</Alert>
}

export default FormError;
