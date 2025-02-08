import { type FC } from 'react';
import {
  type currentValidOrdersResponseType,
  parseCurrentValidOrdersResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

import { Link as RouterLink, useSearchParams } from 'react-router';
import { Link } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { queryParser } from '../../UI/TableMui/query';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import DateWithTooltip from '../../UI/DateWithTooltip/DateWithTooltip';
import FlagExpireDays from '../../UI/Flag/FlagExpireDays';
import FlagLegacyAPI from '../../UI/Flag/FlagLegacyAPI';
import FlagStaging from '../../UI/Flag/FlagStaging';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TablePagination from '../../UI/TableMui/TablePagination';
import TitleBar from '../../UI/TitleBar/TitleBar';

const DASHBOARD_URL = '/v1/orders/currentvalid';

// table headers and sortable param
const tableHeaders: headerType[] = [
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
    id: 'last_access',
    label: 'Last API Access',
    sortable: true,
  },
  {
    id: 'valid_to',
    label: 'Expiration (Remaining)',
    sortable: true,
  },
];

const Dashboard: FC = () => {
  // parse query
  const [searchParams] = useSearchParams();
  const { page, rowsPerPage, queryParams } = queryParser(
    searchParams,
    'valid_to'
  );

  const { getState } = useAxiosGet<currentValidOrdersResponseType>(
    `${DASHBOARD_URL}?${queryParams}`,
    parseCurrentValidOrdersResponseType
  );

  return (
    <TableContainer>
      <TitleBar
        title='Dashboard'
        helpURL='https://www.certwarden.com/docs/user_interface/dashboard/'
      />

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
              {getState.responseData.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={'/certificates/' + order.certificate.id}
                    >
                      {order.certificate.name}
                    </Link>
                  </TableCell>
                  <TableCell>{order.certificate.subject}</TableCell>
                  <TableCell>
                    {order.certificate.acme_account.acme_server.is_staging && (
                      <FlagStaging />
                    )}
                    {order.certificate.api_key_via_url && <FlagLegacyAPI />}
                  </TableCell>
                  <TableCell>
                    <DateWithTooltip unixTime={order.certificate.last_access} />
                  </TableCell>
                  <TableCell>
                    <DateWithTooltip unixTime={order.valid_to} />{' '}
                    <FlagExpireDays
                      validFrom={order.valid_from}
                      validTo={order.valid_to}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={getState?.responseData.total_records}
          />
        </>
      )}
    </TableContainer>
  );
};

export default Dashboard;
