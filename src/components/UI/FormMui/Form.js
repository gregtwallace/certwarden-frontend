import { Box } from '@mui/material';

const Form = (props) => {
  return (
    <Box
      component='form'
      noValidate
      autoComplete='off'
      onSubmit={props.onSubmit}
    >
      {props.children}
    </Box>
  );
};

export default Form;
