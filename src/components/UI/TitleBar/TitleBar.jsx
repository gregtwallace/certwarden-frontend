import PropTypes from 'prop-types';
import { Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';

const TitleBar = (props) => {
  // if headerComponent not specified, set to h2
  let headerComponent = 'h2';
  if (props.headerComponent) {
    headerComponent = props.headerComponent;
  }

  return (
    <Toolbar variant='dense' disableGutters sx={{ m: 0, px: 2 }}>
      <Typography
        component={headerComponent}
        variant='h6'
        color='primary'
        sx={{ flexGrow: 1 }}
        gutterBottom
      >
        {props.title}
      </Typography>
      {props.children}
    </Toolbar>
  );
};

TitleBar.propTypes = {
  title: PropTypes.string.isRequired,
  headerComponent: PropTypes.string,
  children: PropTypes.node,
};

export default TitleBar;
