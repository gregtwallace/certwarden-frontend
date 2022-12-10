import { Paper } from '@mui/material';

const PaperSingle = (props) => {
  return (
    <Paper
      sx={{
        display: 'table',
        width: 1,
        p: 1,
      }}
    >
      {props.children}
    </Paper>
  );
};

export default PaperSingle;
