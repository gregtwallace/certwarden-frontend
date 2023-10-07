import PropTypes from 'prop-types';
import { Container, Paper } from '@mui/material';

const GridItemContainer = (props) => {
  const sx = {
    ...props.sx,
    p: 1,
    height: 1,
  };

  return (
    <Container component={Paper} sx={sx}>
      {props.children}
    </Container>
  );
};

GridItemContainer.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

export default GridItemContainer;
