import PropTypes from 'prop-types';
import { TableCell } from '@mui/material';

const TableHeader = (props) => {
  return <TableCell key={props.id}>{props.label}</TableCell>;
};

TableHeader.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default TableHeader;
