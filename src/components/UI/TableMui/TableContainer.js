import { Paper } from '@mui/material';

const TableContainer = (props) => {
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

export default TableContainer;
