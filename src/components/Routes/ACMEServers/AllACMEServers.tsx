import { type FC } from 'react';
import {
  type acmeServersResponseType,
  parseAcmeServersResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

import { Link as RouterLink, useSearchParams } from 'react-router';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { queryParser } from '../../UI/TableMui/query';
import { newId } from '../../../helpers/constants';

import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import ButtonAsLink from '../../UI/Button/ButtonAsLink';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../UI/TitleBar/TitleBar';
import TablePagination from '../../UI/TableMui/TablePagination';

const ACME_SERVERS_URL = '/v1/acmeservers';

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
    id: 'is_staging',
    label: 'Staging',
    sortable: true,
  },
  {
    id: 'external_account_required',
    label: 'Requires EAB',
    sortable: false,
  },
];

const AllACMEServers: FC = () => {
  // parse query
  const [searchParams] = useSearchParams();
  const { page, rowsPerPage, queryParams } = queryParser(searchParams, 'name');

  const { getState } = useAxiosGet<acmeServersResponseType>(
    `${ACME_SERVERS_URL}?${queryParams}`,
    parseAcmeServersResponseType
  );

  return (
    <TableContainer>
      <TitleBar
        title='ACME Servers'
        helpURL='https://www.certwarden.com/docs/user_interface/acme_servers/'

      >
        <ButtonAsLink to={`/acmeservers/${newId}`}>New Server</ButtonAsLink>
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
              {getState.responseData.acme_servers.map((serv) => (
                <TableRow key={serv.id}>
                  <TableCell>
                    <Link component={RouterLink} to={'/acmeservers/' + serv.id}>
                      {serv.name}
                    </Link>
                  </TableCell>

                  <TableCell>{serv.description}</TableCell>

                  <TableCell>{serv.is_staging ? 'Yes' : 'No'}</TableCell>

                  <TableCell>
                    {serv.external_account_required ? 'Yes' : 'No'}
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

export default AllACMEServers;
