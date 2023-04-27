import { Grid } from '@mui/material';

const GridItemThird = (props) => {
  return (
    <Grid item xs={2} sm={4} md={4}>
      {props.children}
    </Grid>
  );
};

export default GridItemThird;
