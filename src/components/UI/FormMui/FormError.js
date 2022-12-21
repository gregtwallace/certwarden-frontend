import Alert from '@mui/material/Alert';

const FormError = (props) => {
  return (
    <Alert severity='error' sx={{ my: 1 }}>
      {props.children}
    </Alert>
  );
};

export default FormError;
