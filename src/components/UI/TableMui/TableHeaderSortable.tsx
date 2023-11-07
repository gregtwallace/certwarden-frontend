import { type FC } from 'react';

import { TableCell, TableSortLabel } from '@mui/material';

type propTypes = {
  id: string;
  label: string;
  orderBy: string;
  order: 'desc' | 'asc';
  onClick: (id: string) => void;
};

const TableHeaderSortable: FC<propTypes> = (props) => {
  const { id, label, orderBy, order, onClick } = props;

  return (
    <TableCell>
      <TableSortLabel
        active={orderBy === id}
        direction={order}
        onClick={(_event) => onClick(id)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};

export default TableHeaderSortable;
