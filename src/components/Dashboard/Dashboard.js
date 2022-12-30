import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Link } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useAxiosGet from '../../hooks/useAxiosGet';
import { convertUnixTime, daysUntil } from '../../helpers/time';
import { getRowsPerPage, getPage, getSort } from '../UI/TableMui/query';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Flag from '../UI/Flag/Flag';
import TableContainer from '../UI/TableMui/TableContainer';
import TableHeaderRow from '../UI/TableMui/TableHeaderRow';
import TablePagination from '../UI/TableMui/TablePagination';
import TitleBar from '../UI/TitleBar/TitleBar';

// table headers and sortable param
const tableHeaders = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    id: 'subject',
    label: 'Subject',
    sortable: true,
  },
  {
    id: 'flags',
    label: 'Flags',
    sortable: false,
  },
  {
    id: 'valid_to',
    label: 'Expiration (Remaining)',
    sortable: true,
  },
];

const Dashboard = () => {
  const [searchParams] = useSearchParams();

  // get calculated query params
  const rowsPerPage = getRowsPerPage(searchParams);
  const page = getPage(searchParams);
  const sort = getSort(searchParams, 'valid_to', 'asc');

  // calculate offset from current page and rows per page
  const offset = page * rowsPerPage;

  const [apiGetState] = useAxiosGet(
    `/v1/orders/currentvalid?limit=${rowsPerPage}&offset=${offset}&sort=${sort}`,
    'valid_current_orders',
    true
  );

  // TODO: useEffect - go to page 0 if page is greater than last page
  // Requires updating backend to always return total even when out of bounds

  return (
    <TableContainer>
      <TitleBar title='Dashboard' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {apiGetState.isLoaded && !apiGetState.errorMessage && (
        <>
          <Table size='small'>
            <TableHead>
              <TableHeaderRow headers={tableHeaders} />
            </TableHead>
            <TableBody>
              {apiGetState?.valid_current_orders?.orders?.length > 0 &&
                apiGetState.valid_current_orders.orders.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/certificates/' + m.certificate.id}
                      >
                        {m.certificate.name}
                      </Link>
                    </TableCell>
                    <TableCell>{m.certificate.subject}</TableCell>
                    <TableCell>
                      {m.certificate.acme_account.is_staging && (
                        <Flag type='staging' />
                      )}
                      {m.certificate.api_key_via_url && (
                        <Flag type='legacy_api' />
                      )}
                      {!m.certificate.challenge_method.enabled && (
                        <Flag type='method' />
                      )}
                    </TableCell>
                    <TableCell>
                      {convertUnixTime(m.valid_to)}{' '}
                      <Flag type='expire-days' days={daysUntil(m.valid_to)} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={apiGetState?.valid_current_orders?.total_orders}
          />
        </>
      )}
    </TableContainer>
  );
};

export default Dashboard;
