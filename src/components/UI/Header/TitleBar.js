import { Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';

const TitleBar = (props) => {
  return (
    <Toolbar variant='dense' sx={{ m: 0, p: 0 }}>
      <Typography
        component='h2'
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

export default TitleBar;
