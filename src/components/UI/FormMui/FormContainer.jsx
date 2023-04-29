import PropTypes from 'prop-types';
import { Container, Paper } from '@mui/material';

const FormContainer = (props) => {
  return (
    <Container component={Paper} maxWidth='sm' sx={{ mb: 3, p: 1 }}>
      {props.children}
    </Container>
  );
};

FormContainer.propTypes = {
  children: PropTypes.node,
}

export default FormContainer;
