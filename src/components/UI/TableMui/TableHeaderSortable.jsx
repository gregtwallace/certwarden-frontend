import { Box, TableCell, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

const TableHeaderSortable = (props) => {
  const handleClick = () => {
    props.onClick(props.id);
  };

  return (
    <TableCell key={props.id}>
      <TableSortLabel
        active={props.orderBy === props.id}
        direction={props.orderBy === props.id ? props.order : 'asc'}
        onClick={handleClick}
      >
        {props.label}
        {props.orderBy === props.id ? (
          <Box component='span' sx={visuallyHidden}>
            {props.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </Box>
        ) : null}
      </TableSortLabel>
    </TableCell>
  );
};

export default TableHeaderSortable;
