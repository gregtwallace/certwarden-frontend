import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

const GridContainer = (props) => {
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {props.children}
    </Grid>
  );
};

GridContainer.propTypes = {
  children: PropTypes.node,
}

export default GridContainer;
