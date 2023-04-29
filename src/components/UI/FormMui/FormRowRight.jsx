import PropTypes from 'prop-types';
import { Box, Toolbar } from '@mui/material';

const FormRowRight = (props) => {
  return (
    <Toolbar variant='dense' disableGutters sx={{ mb: 1 }}>
      <Box sx={{ flexGrow: 1 }}></Box>
      {props.children}
    </Toolbar>
  );
};

FormRowRight.propTypes = {
  children: PropTypes.node,
}

export default FormRowRight;
