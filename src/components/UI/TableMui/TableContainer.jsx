import PropTypes from 'prop-types';
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

TableContainer.propTypes = {
  children: PropTypes.node,
}

export default TableContainer;
