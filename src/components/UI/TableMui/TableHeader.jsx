import { TableCell } from '@mui/material';

const TableHeader = (props) => {
  return <TableCell key={props.id}>{props.label}</TableCell>;
};

export default TableHeader;
