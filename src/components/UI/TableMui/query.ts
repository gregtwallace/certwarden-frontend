import { isInteger } from '../../../helpers/form-validation';

export const perPageOptions = [5, 10, 20, 50];

const defPage = 0;
const perPageItemNamePrefix = 'rows_per_page';
const perPageDefaultValue = 20;

// type for storing per page settings
export type storageSuffixType = 'orders' | '';

export const getRowsPerPageInfo = (
  storageSuffix: storageSuffixType = ''
): [storageItemName: string, defaultValue: number] => {
  if (storageSuffix !== '') {
    return [perPageItemNamePrefix + '_' + storageSuffix, 5];
  }

  return [perPageItemNamePrefix, perPageDefaultValue];
};

// getRowsPerPage returns the rows per page that is specified
// or the default if specified is not valid
const getRowsPerPage = (storageSuffix: storageSuffixType = ''): number => {
  // set storage name and default value based on suffix
  const [storageItemName, defaultRows] = getRowsPerPageInfo(storageSuffix);

  // if no param, use default
  const perPageParam = localStorage.getItem(storageItemName);
  if (perPageParam === null) {
    return defaultRows;
  }

  // if not an integer, use default
  if (!isInteger(perPageParam)) {
    return defaultRows;
  }

  // if not included as an option in rows per page, use default
  const perPageVal = parseInt(perPageParam);
  if (!perPageOptions.includes(perPageVal)) {
    return defaultRows;
  }

  return perPageVal;
};

// getPage returns the page that is specified or the default if
// specified is not valid
const getPage = (searchParams: URLSearchParams): number => {
  // if no param, use default
  const pageParam = searchParams.get('page');
  if (pageParam === null) {
    return defPage;
  }

  // if not an integer, use default
  if (!isInteger(pageParam)) {
    return defPage;
  }

  // if < 0, use default
  const pageVal = parseInt(pageParam);
  if (isNaN(pageVal) || pageVal < 0) {
    return defPage;
  }

  return pageVal;
};

// getSort returns the sort that is specified or the default if
// the specified sort cannot be parsed
const getSort = (
  searchParams: URLSearchParams,
  defaultField: string,
  defaultDirection: 'asc' | 'desc'
): string => {
  // default
  const defaultSort = defaultField + '.' + defaultDirection;

  // calculate sort logic
  const sortParam = searchParams.get('sort');

  // if no param, use default
  if (sortParam === null) {
    return defaultSort;
  }

  // if wrong number of components, use default
  const sortComponents = sortParam.split('.');
  if (sortComponents.length !== 2) {
    return defaultSort;
  }

  // use param sort
  if (sortComponents[0] === undefined || sortComponents[1] === undefined) {
    return defaultSort;
  }
  const orderBy = sortComponents[0];
  const order = sortComponents[1];

  // default to asc (in case invalid)
  if (order !== 'desc') {
    return orderBy + '.asc';
  }

  return orderBy + '.' + order;
};

// type for query / param parser
type queryParserReturnType = {
  rowsPerPage: number;
  page: number;
  queryParams: string;
};

// export unified query / param parser
export const queryParser = (
  searchParams: URLSearchParams,
  defaultSortField: string,
  defaultSortDirection: 'asc' | 'desc' = 'asc',
  perPageSuffix: storageSuffixType = ''
): queryParserReturnType => {
  const sort = getSort(searchParams, defaultSortField, defaultSortDirection);
  const page = getPage(searchParams);
  const rowsPerPage = getRowsPerPage(perPageSuffix);

  // calculate offset
  const pageOffset = page * rowsPerPage;

  // make query params (piece after `?`)
  const queryParams = `limit=${rowsPerPage.toString()}&offset=${pageOffset.toString()}&sort=${sort}`;

  return { page, rowsPerPage, queryParams };
};
