import { Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';

const GridTitle = (props) => {
  // if headerComponent not specified, set to h3
  let headerComponent = 'h3';
  if (props.headerComponent) {
    headerComponent = props.headerComponent;
  }

  return (
    <Toolbar variant='dense' disableGutters sx={{ m: 0, px: 1 }}>
      <Typography
        component={headerComponent}
        variant='subtitle2'
        color='primary'
        sx={{ flexGrow: 1 }}
        gutterBottom
      >
        {props.title}
      </Typography>
    </Toolbar>
  );
};

export default GridTitle;
