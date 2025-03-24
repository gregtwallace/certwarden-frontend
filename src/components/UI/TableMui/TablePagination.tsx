import { type ChangeEvent, type FC, type MouseEvent } from 'react';
import { storageSuffixType } from './query';

import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { perPageOptions, getRowsPerPageInfo } from './query';

import { TablePagination as MuiTablePagination } from '@mui/material';

type propTypes = {
  page: number;
  rowsPerPage: number;
  count: number;
  storageSuffix?: storageSuffixType;
};

const TablePagination: FC<propTypes> = (props) => {
  const { count, page, rowsPerPage, storageSuffix } = props;

  // get storage item name
  const [storageItemName] = getRowsPerPageInfo(storageSuffix);

  // page is valid if page 0 (1st page) -or-
  // valid if page beginning is within the result set (that is,
  // if page < count / rowsPerPage)
  const pageIsValid =
    page === 0 || page < count / parseFloat(rowsPerPage.toString());

  const [searchParams, setSearchParams] = useSearchParams();

  // page change handler
  const pageChangeHandler = (_event: MouseEvent | null, page: number): void => {
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
    localStorage.setItem(storageItemName, newRowsPerPage.toString());
    setSearchParams(searchParams);
  };

  // if page is invalid, delete page then reload
  useEffect(() => {
    if (!pageIsValid) {
      searchParams.delete('page');
      setSearchParams(searchParams);
    }
  }, [pageIsValid, searchParams, setSearchParams]);

  return (
    <>
      {pageIsValid && (
        <MuiTablePagination
          rowsPerPageOptions={perPageOptions}
          component='div'
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={pageChangeHandler}
          onRowsPerPageChange={rowPerPageChangeHandler}
        ></MuiTablePagination>
      )}
    </>
  );
};

export default TablePagination;
