import { Typography } from '@mui/material';

const FormInfo = (props) => {
  return (
    <Typography variant='subtitle2' fontWeight='regular'>
      {props.children}
    </Typography>
  );
};

export default FormInfo;
