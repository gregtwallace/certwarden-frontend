import { Container, Paper } from '@mui/material';

const FormContainer = (props) => {
  return (
    <Container component={Paper} maxWidth='sm' sx={{ mb: 3, p: 1 }}>
      {props.children}
    </Container>
  );
};

export default FormContainer;
