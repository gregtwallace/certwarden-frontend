export const perPageOptions = [5, 10, 20, 50];
const defaultRowsPerPage = 20;

// getRowsPerPage returns the rows per page that is specified
// or the default if specified is not valid
export const getRowsPerPage = (
  searchParams,
  defaultRows = defaultRowsPerPage
) => {
  let rowsPerPage = parseInt(searchParams.get('perpage'));

  // set default perpage if not specified or invalid
  if (
    rowsPerPage == null ||
    isNaN(rowsPerPage) ||
    !perPageOptions.includes(rowsPerPage)
  ) {
    rowsPerPage = defaultRows;
  }

  return rowsPerPage;
};

// getPage returns the page that is specified or the default if
// specified is not valid
export const getPage = (searchParams) => {
  let page = parseInt(searchParams.get('page'));

  // set default page if not specified or invalid
  if (page == null || isNaN(page) || page < 0) {
    page = 0;
  }

  return page;
};

// getSort returns the sort that is specified or the default if
// the specified sort cannot be parsed
export const getSort = (searchParams, defaultField, defaultDirection) => {
  // calculate sort logic
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
  } else {
    orderBy = defaultField;
    order = defaultDirection;
  }

  // if order is not asc or desc, set 'asc'
  if (order !== 'asc' && order !== 'desc') {
    order = 'asc';
  }

  return orderBy + '.' + order;
};
