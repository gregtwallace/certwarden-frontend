import { type FC } from 'react';

import { useSearchParams } from 'react-router';

import { TableRow } from '@mui/material';

import TableHeaderSortable from './TableHeaderSortable';
import TableHeader from './TableHeader';

export type headerType = {
  id: string;
  label: string;
  sortable: boolean;
};

type propTypes = {
  headers: headerType[];
};

const TableHeaderRow: FC<propTypes> = (props) => {
  const { headers } = props;

  const [searchParams, setSearchParams] = useSearchParams();

  // set sort (blank if can't parse string)
  const currentSort = searchParams.get('sort');
  let orderBy = '';
  let order: 'asc' | 'desc' = 'asc';

  if (currentSort != null) {
    const sortComponents = currentSort.split('.');
    if (
      sortComponents.length === 2 &&
      sortComponents[0] &&
      (sortComponents[1] === 'asc' || sortComponents[1] === 'desc')
    ) {
      orderBy = sortComponents[0];
      order = sortComponents[1];
    }
  }

  // setSortHandler changes the sort when a column is clicked
  const setSortHandler = (headerId: string): void => {
    // default to 'asc' for new column selected
    let newOrder: 'asc' | 'desc' = 'asc';
    // if col is already the orderBy, reverse direction
    if (headerId === orderBy && order === 'asc') {
      newOrder = 'desc';
    }

    // update sort in search params
    searchParams.set('sort', `${headerId}.${newOrder}`);
    setSearchParams(searchParams);
  };

  return (
    <TableRow>
      {headers.map((header) => {
        if (header.sortable) {
          return (
            <TableHeaderSortable
              key={header.id}
              id={header.id}
              label={header.label}
              orderBy={orderBy}
              order={order}
              onClick={setSortHandler}
            />
          );
        }
        return (
          <TableHeader key={header.id} id={header.id} label={header.label} />
        );
      })}
    </TableRow>
  );
};

export default TableHeaderRow;
