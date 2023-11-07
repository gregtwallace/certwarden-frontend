import { type FC } from 'react';

import { TableCell } from '@mui/material';

type propTypes = {
  id: string;
  label: string;
};

const TableHeader: FC<propTypes> = (props) => {
  const { id, label } = props;

  return <TableCell key={id}>{label}</TableCell>;
};

export default TableHeader;
