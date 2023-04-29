import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';

import { TableRow } from '@mui/material';
import TableHeaderSortable from './TableHeaderSortable';
import TableHeader from './TableHeader';

const TableHeaderRow = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // set sort (blank if can't parse string)
  let sort = searchParams.get('sort');
  let orderBy = '';
  let order = '';

  let sortComponents;
  if (sort != null) {
    sortComponents = sort.split('.');
  }
  if (sortComponents?.length === 2) {
    orderBy = sortComponents[0];
    order = sortComponents[1];
  }

  // setSortHandler changes the sort when a column is clicked
  const setSortHandler = (headerId) => {
    // check if the headerId is for current sort
    // if so, reverse the order
    let newOrder = '';
    if (headerId === orderBy) {
      if (order === 'asc') {
        newOrder = 'desc';
      } else {
        newOrder = 'asc';
      }
    } else {
      // if changing col, default to asc
      newOrder = 'asc';
    }

    let newParams = searchParams;
    newParams.set('sort', `${headerId}.${newOrder}`);

    setSearchParams(newParams);
  };

  return (
    <TableRow>
      {props.headers.map((h) => {
        if (h.sortable) {
          return (
            <TableHeaderSortable
              key={h.id}
              id={h.id}
              label={h.label}
              orderBy={orderBy}
              order={order}
              onClick={setSortHandler}
            />
          );
        }
        return <TableHeader key={h.id} id={h.id} label={h.label} />;
      })}
    </TableRow>
  );
};

TableHeaderRow.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    }).isRequired
  ),
};

export default TableHeaderRow;
