import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Link } from '@mui/material';

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCell } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useAxiosGet from '../../hooks/useAxiosGet';
import { getRowsPerPage, getPage, getSort } from '../UI/TableMui/query';
import { newId } from '../../helpers/constants';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import TableContainer from '../UI/TableMui/TableContainer';
import TableHeaderRow from '../UI/TableMui/TableHeaderRow';
import TitleBar from '../UI/TitleBar/TitleBar';
import TablePagination from '../UI/TableMui/TablePagination';

// table headers and sortable param
const tableHeaders = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    id: 'description',
    label: 'Description',
    sortable: true,
  },
  {
    id: 'keyname',
    label: 'Key',
    sortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    id: 'email',
    label: 'E-Mail',
    sortable: true,
  },
  {
    id: 'is_staging',
    label: 'Environment',
    sortable: true,
  },
];

const AllACMEAccounts = () => {
  const [searchParams] = useSearchParams();

  // get calculated query params
  const rowsPerPage = getRowsPerPage(searchParams);
  const page = getPage(searchParams);
  const sort = getSort(searchParams, 'name', 'asc');

  // calculate offset from current page and rows per page
  const offset = page * rowsPerPage;

  const [apiGetState] = useAxiosGet(
    `/v1/acmeaccounts?limit=${rowsPerPage}&offset=${offset}&sort=${sort}`,
    'all_acme_accounts',
    true
  );

  // click new / navigation
  const navigate = useNavigate();

  const newClickHandler = (event) => {
    event.preventDefault();
    navigate(`/acmeaccounts/${newId}`);
  };

  return (
    <TableContainer>
      <TitleBar title='ACME Accounts'>
        <Button variant='contained' type='submit' onClick={newClickHandler}>
          New Account
        </Button>
      </TitleBar>
      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
      )}
      {apiGetState.isLoaded && !apiGetState.errorMessage && (
        <>
          <Table size='small'>
            <TableHead>
              <TableHeaderRow headers={tableHeaders} />
            </TableHead>
            <TableBody>
              {apiGetState?.all_acme_accounts?.acme_accounts?.length > 0 &&
                apiGetState.all_acme_accounts.acme_accounts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Link component={RouterLink} to={'/acmeaccounts/' + a.id}>
                        {a.name}
                      </Link>
                    </TableCell>
                    <TableCell>{a.description}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/privatekeys/' + a.private_key.id}
                      >
                        {a.private_key.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>
                      {a.acme_server.is_staging ? 'Staging' : 'Production'}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={apiGetState?.all_acme_accounts?.total_records}
          />
        </>
      )}
    </TableContainer>
  );
};

export default AllACMEAccounts;
