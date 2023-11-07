import { type ChangeEvent, type FC, type MouseEvent } from 'react';

import { useSearchParams } from 'react-router-dom';

import { perPageOptions } from './query';

import { TablePagination as MuiTablePagination } from '@mui/material';

type propTypes = {
  page: number;
  rowsPerPage: number;
  count: number;
};

const TablePagination: FC<propTypes> = (props) => {
  const { count, page, rowsPerPage } = props;

  const [searchParams, setSearchParams] = useSearchParams();

  // page change handler
  const pageChangeHandler = (
    __event: MouseEvent | null,
    page: number
  ): void => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  // row per page change handler
  const rowPerPageChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    // new rows per page
    const newRowsPerPage = parseInt(event.target.value);

    // calculate new page number to show same data begin (offset)
    const newPage = Math.floor((page * rowsPerPage) / newRowsPerPage);

    // set new page and per page
    searchParams.set('page', newPage.toString());
    searchParams.set('perpage', newRowsPerPage.toString());
    setSearchParams(searchParams);
  };

  return (
    <MuiTablePagination
      rowsPerPageOptions={perPageOptions}
      component='div'
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={pageChangeHandler}
      onRowsPerPageChange={rowPerPageChangeHandler}
    ></MuiTablePagination>
  );
};

export default TablePagination;
