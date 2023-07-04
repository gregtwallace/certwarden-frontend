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

import useAxiosGet from '../../../hooks/useAxiosGet';
import { getRowsPerPage, getPage, getSort } from '../../UI/TableMui/query';
import { newId } from '../../../helpers/constants';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import Flag from '../../UI/Flag/Flag';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../UI/TitleBar/TitleBar';
import TablePagination from '../../UI/TableMui/TablePagination';

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
    id: 'flags',
    label: 'Flags',
    sortable: false,
  },
  {
    id: 'algorithm',
    label: 'Algorithm',
    sortable: true,
  },
];

const AllPrivateKeys = () => {
  const [searchParams] = useSearchParams();

  // get calculated query params
  const rowsPerPage = getRowsPerPage(searchParams);
  const page = getPage(searchParams);
  const sort = getSort(searchParams, 'name', 'asc');

  // calculate offset from current page and rows per page
  const offset = page * rowsPerPage;

  const [apiGetState] = useAxiosGet(
    `/v1/privatekeys?limit=${rowsPerPage}&offset=${offset}&sort=${sort}`,
    'all_private_keys',
    true
  );

  // click new / navigation
  const navigate = useNavigate();

  const newClickHandler = (event) => {
    event.preventDefault();
    navigate(`/privatekeys/${newId}`);
  };

  return (
    <TableContainer>
      <TitleBar title='Private Keys'>
        <Button variant='contained' type='submit' onClick={newClickHandler}>
          New Key
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
              {apiGetState?.all_private_keys?.private_keys?.length > 0 &&
                apiGetState.all_private_keys.private_keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>
                      <Link component={RouterLink} to={'/privatekeys/' + k.id}>
                        {k.name}
                      </Link>
                    </TableCell>
                    <TableCell>{k.description}</TableCell>
                    <TableCell>
                      {k.api_key_via_url && <Flag type='legacy_api' />}
                      {k.api_key_disabled && <Flag type='api_key_disabled' />}
                    </TableCell>
                    <TableCell>{k.algorithm.name}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={apiGetState?.all_private_keys?.total_records}
          />
        </>
      )}
    </TableContainer>
  );
};

export default AllPrivateKeys;
