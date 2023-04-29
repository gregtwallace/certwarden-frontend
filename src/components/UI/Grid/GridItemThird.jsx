import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

const GridItemThird = (props) => {
  return (
    <Grid item xs={2} sm={4} md={4}>
      {props.children}
    </Grid>
  );
};

GridItemThird.propTypes = {
  children: PropTypes.node,
};

export default GridItemThird;
