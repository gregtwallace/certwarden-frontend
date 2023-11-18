import { type FC } from 'react';
import {
  type acmeAccountsResponseType,
  parseAcmeAccountsResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Link } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCell } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { queryParser } from '../../UI/TableMui/query';
import { newId } from '../../../helpers/constants';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import ButtonAsLink from '../../UI/Button/ButtonAsLink';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../UI/TitleBar/TitleBar';
import TablePagination from '../../UI/TableMui/TablePagination';

const ACME_ACCOUNTS_URL = '/v1/acmeaccounts';

// table headers and sortable param
const tableHeaders: headerType[] = [
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

const AllACMEAccounts: FC = () => {
  // parse query
  const [searchParams] = useSearchParams();
  const { page, rowsPerPage, queryParams } = queryParser(searchParams, 'name');

  const { getState } = useAxiosGet<acmeAccountsResponseType>(
    `${ACME_ACCOUNTS_URL}?${queryParams}`,
    parseAcmeAccountsResponseType
  );

  return (
    <TableContainer>
      <TitleBar title='ACME Accounts'>
        <ButtonAsLink to={`/acmeaccounts/${newId}`}>New Account</ButtonAsLink>
      </TitleBar>

      {!getState.responseData && !getState.error && <ApiLoading />}

      {getState.error && (
        <ApiError
          statusCode={getState.error.statusCode}
          message={getState.error.message}
        />
      )}

      {getState.responseData && (
        <>
          <Table size='small'>
            <TableHead>
              <TableHeaderRow headers={tableHeaders} />
            </TableHead>
            <TableBody>
              {getState.responseData.acme_accounts.length > 0 &&
                getState.responseData.acme_accounts.map((acct) => (
                  <TableRow key={acct.id}>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/acmeaccounts/' + acct.id}
                      >
                        {acct.name}
                      </Link>
                    </TableCell>
                    <TableCell>{acct.description}</TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/privatekeys/' + acct.private_key.id}
                      >
                        {acct.private_key.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {acct.status.charAt(0).toUpperCase() +
                        acct.status.slice(1)}
                    </TableCell>
                    <TableCell>{acct.email}</TableCell>
                    <TableCell>
                      {acct.acme_server.is_staging ? 'Staging' : 'Production'}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={getState.responseData.total_records}
          />
        </>
      )}
    </TableContainer>
  );
};

export default AllACMEAccounts;
