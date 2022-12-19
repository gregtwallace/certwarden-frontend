import { Container, Paper } from '@mui/material';

const FormContainer = (props) => {
  return (
    <Container component={Paper} maxWidth='sm' sx={{ p: 1 }}>
      {props.children}
    </Container>
  );
};

export default FormContainer;
