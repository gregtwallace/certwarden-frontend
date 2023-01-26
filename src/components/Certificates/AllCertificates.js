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
import { newId } from '../../App';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Flag from '../UI/Flag/Flag';
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
    id: 'keyname',
    label: 'Key',
    sortable: true,
  },
  {
    id: 'accountname',
    label: 'Account',
    sortable: true,
  },
];

const AllCertificates = () => {
  const [searchParams] = useSearchParams();

  // get calculated query params
  const rowsPerPage = getRowsPerPage(searchParams);
  const page = getPage(searchParams);
  const sort = getSort(searchParams, 'name', 'asc');

  // calculate offset from current page and rows per page
  const offset = page * rowsPerPage;

  const [apiGetState] = useAxiosGet(
    `/v1/certificates?limit=${rowsPerPage}&offset=${offset}&sort=${sort}`,
    'all_certificates',
    true
  );

  // click new / navigation
  const navigate = useNavigate();

  const newClickHandler = (event) => {
    event.preventDefault();
    navigate(`/certificates/${newId}`);
  };

  return (
    <TableContainer>
      <TitleBar title='Certificates'>
        <Button variant='contained' type='submit' onClick={newClickHandler}>
          New Certificate
        </Button>
      </TitleBar>
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
              {apiGetState?.all_certificates?.certificates?.length > 0 &&
                apiGetState.all_certificates.certificates.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link component={RouterLink} to={'/certificates/' + c.id}>
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell>{c.subject}</TableCell>
                    <TableCell>
                      {c.acme_account.is_staging && <Flag type='staging' />}
                      {c.api_key_via_url && <Flag type='legacy_api' />}
                      {!c.challenge_method.enabled && <Flag type='method' />}
                    </TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/privatekeys/' + c.private_key.id}
                      >
                        {c.private_key.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/acmeaccounts/' + c.acme_account.id}
                      >
                        {c.acme_account.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={apiGetState?.all_certificates?.total_records}
          />
        </>
      )}
    </TableContainer>
  );

  //                   {!m.challenge_method.enabled && <Flag type='method' />}
};

export default AllCertificates;
