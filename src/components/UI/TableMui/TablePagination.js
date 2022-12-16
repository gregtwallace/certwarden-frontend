import { useSearchParams } from 'react-router-dom';

import { getRowsPerPage, getPage, perPageOptions } from './query';

import MuiTablePagination from '@mui/material/TablePagination';

const TablePagination = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rowsPerPage = getRowsPerPage(searchParams);
  const page = getPage(searchParams);

  // page change handler
  const pageChangeHandler = (_, newPage) => {
    let newParams = searchParams;
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  // row per page change handler
  const rowPerPageChangeHandler = (event) => {
    // new rows per page
    let newRowsPerPage = parseInt(event.target.value, 10);

    // calculate new page number to show same data start (offset)
    let newPage = Math.floor((page * rowsPerPage) / newRowsPerPage);

    let newParams = searchParams;
    newParams.set('page', newPage);

    // set rows per page
    newParams.set('perpage', newRowsPerPage);

    setSearchParams(newParams);
  };

  return (
    <MuiTablePagination
      rowsPerPageOptions={perPageOptions}
      component='div'
      count={props.count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={pageChangeHandler}
      onRowsPerPageChange={rowPerPageChangeHandler}
    ></MuiTablePagination>
  );
};

export default TablePagination;
