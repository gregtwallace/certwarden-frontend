import { Box, Toolbar } from '@mui/material';

const FormFooter = (props) => {
  return (
    <Toolbar variant='dense' sx={{ mt: 2, p: 0 }}>
      <Box sx={{ flexGrow: 1 }} />
      {props.children}
    </Toolbar>
  );
};

export default FormFooter;
