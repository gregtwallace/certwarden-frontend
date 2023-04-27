import Alert from '@mui/material/Alert';

const ApiError = (props) => {
  return (
    <Alert sx={{ m: 2 }} severity='error'>
      An API error has occurred. {props.children}
    </Alert>
  );
};

export default ApiError;
