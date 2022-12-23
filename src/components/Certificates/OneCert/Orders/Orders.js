import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Link } from '@mui/material';

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import { getRowsPerPage, getPage, getSort } from '../../../UI/TableMui/query';
import { convertUnixTime } from '../../../../helpers/time';

import ApiLoading from '../../../UI/Api/ApiLoading';
import ApiError from '../../../UI/Api/ApiError';
import TableContainer from '../../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../../UI/Header/TitleBar';
import TablePagination from '../../../UI/TableMui/TablePagination';

// table headers and sortable param
const tableHeaders = [
  {
    id: 'created_at',
    label: 'Created At',
    sortable: true,
  },
  {
    id: 'valid_to',
    label: 'Valid To',
    sortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    id: 'keyname',
    label: 'Key',
    sortable: true,
  },
  {
    id: 'actions',
    label: 'Actions',
    sortable: false,
  },
];

const Orders = (props) => {
  const [searchParams] = useSearchParams();

  // get calculated query params
  const rowsPerPage = getRowsPerPage(searchParams, 5);
  const page = getPage(searchParams);
  const sort = getSort(searchParams, 'created_at', 'desc');

  // calculate offset from current page and rows per page
  const offset = page * rowsPerPage;

  const [apiGetState, updateGet] = useAxiosGet(
    `/v1/certificates/${props.certId}/orders?limit=${rowsPerPage}&offset=${offset}&sort=${sort}`,
    'all_orders',
    true
  );

  // action handlers
  // Rather than making another sendApi, use the parent component's.
  // This allows disabling the parent's buttons also
  const [sendApiState, sendData] = [props.sendApiState, props.sendData];

  // handler to place a new order
  const newOrderHandler = (event) => {
    sendData(
      `/v1/certificates/${props.certId}/orders`,
      'POST',
      null,
      true
    ).then((success) => {
      updateGet();
    });
  };

  // handler to retry an existing order that isn't valid or invalid
  const retryOrderHandler = (event, orderId) => {
    event.preventDefault();

    sendData(
      `/v1/certificates/${props.certId}/orders/${orderId}`,
      'POST',
      null,
      true
    ).then((success) => {
      updateGet();
    });
  };

  // handler to revoke a valid order's certificate
  const revokeCertHandler = (event, orderId) => {
    event.preventDefault();

    // TODO: add ability to specify revocation reason
    sendData(
      `/v1/certificates/${props.certId}/orders/${orderId}/revoke`,
      'POST',
      null,
      true
    ).then((success) => {
      updateGet();
    });
  };
  // action handlers -- end

  // consts related to rendering
  const renderApiItems = apiGetState.isLoaded && !apiGetState.errorMessage;

  return (
    <TableContainer>
      <TitleBar title='ACME Orders' headerComponent='h3'>
        {renderApiItems && (
          <Button
            variant='contained'
            type='submit'
            size='small'
            onClick={newOrderHandler}
          >
            Place New Order
          </Button>
        )}
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
              {apiGetState?.all_orders?.orders?.length > 0 &&
                apiGetState.all_orders.orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{convertUnixTime(o.created_at)}</TableCell>
                    <TableCell>{convertUnixTime(o.valid_to)}</TableCell>
                    <TableCell>
                      {o.known_revoked
                        ? 'Revoked'
                        : o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </TableCell>
                    <TableCell>
                      {o.finalized_key && (
                        <Link
                          component={RouterLink}
                          to={`/privatekeys/${o.finalized_key.id}`}
                        >
                          {o.finalized_key.name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      {o.status !== 'valid' && o.status !== 'invalid' && (
                        <Button
                          variant='contained'
                          size='small'
                          color='info'
                          type='submit'
                          disabled={sendApiState.isSending}
                          onClick={(event) => retryOrderHandler(event, o.id)}
                        >
                          Retry
                        </Button>
                      )}
                      {o.status === 'valid' &&
                        !o.known_revoked &&
                        Date.now() / 1000 < o.valid_to && (
                          <Button
                            variant='contained'
                            size='small'
                            color='error'
                            type='submit'
                            disabled={sendApiState.isSending}
                            onClick={(event) => revokeCertHandler(event, o.id)}
                          >
                            Revoke
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={apiGetState?.all_orders?.total_records}
          />
        </>
      )}
    </TableContainer>
  );
};

export default Orders;
