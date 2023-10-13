import { useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Link } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import {
  getRowsPerPage,
  getPage,
  getSort,
} from '../../../../UI/TableMui/query';
import { convertUnixTime } from '../../../../../helpers/time';
import { downloadBlob } from '../../../../../helpers/download';

import ApiLoading from '../../../../UI/Api/ApiLoading';
import ApiError from '../../../../UI/Api/ApiError';
import Button from '../../../../UI/Button/Button';
import TableContainer from '../../../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../../../UI/TitleBar/TitleBar';
import TablePagination from '../../../../UI/TableMui/TablePagination';

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

  // func for if a unix timestamp is expired
  const isExpired = (unixTime) => Date.now() / 1000 > unixTime;

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

  // set parent's hasValidOrders
  const { setHasValidOrders } = props;
  useEffect(() => {
    // func for if an order is usable (i.e. 'valid' + not revoked + not expired)
    const isUsable = (order) =>
      order.status === 'valid' &&
      !order.known_revoked &&
      !isExpired(order.valid_to);

    // check if any orders, and if any are usable
    if (
      setHasValidOrders &&
      apiGetState?.all_orders?.orders?.length > 0 &&
      apiGetState.all_orders.orders.some(isUsable)
    ) {
      // if so, check if any are usable

      setHasValidOrders(true);
    } else {
      // no usable orders
      setHasValidOrders(false);
    }
  }, [setHasValidOrders, apiGetState?.all_orders?.orders]);

  // action handlers
  // Rather than making another sendApi, use the parent component's.
  // This allows disabling the parent's buttons also
  const [apiSendState, sendData] = [props.sendApiState, props.sendData];

  // download order pem
  const downloadClickHandler = (orderId) => {
    if (apiGetState?.all_orders) {
      sendData(
        `/v1/certificates/${props.certId}/orders/${orderId}/download`,
        'GET',
        null,
        true,
        'blob'
      ).then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          downloadBlob(response);
        }
      });
    }
  };

  // handler to place a new order
  const newOrderHandler = () => {
    sendData(
      `/v1/certificates/${props.certId}/orders`,
      'POST',
      null,
      true
    ).then(() => {
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
    ).then(() => {
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
    ).then(() => {
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
              {apiGetState?.all_orders?.orders?.length > 0 &&
                apiGetState.all_orders.orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{convertUnixTime(o.created_at)}</TableCell>
                    <TableCell>{convertUnixTime(o.valid_to)}</TableCell>
                    <TableCell>
                      {o.known_revoked
                        ? 'Revoked'
                        : o.status === 'valid' && isExpired(o.valid_to)
                        ? 'Expired'
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
                          disabled={apiSendState.isSending}
                          onClick={(event) => retryOrderHandler(event, o.id)}
                        >
                          Retry
                        </Button>
                      )}
                      {o.status === 'valid' &&
                        !o.known_revoked &&
                        Date.now() / 1000 < o.valid_to && (
                          <>
                            <Button
                              variant='contained'
                              size='small'
                              color='primary'
                              sx={{ mr: 1 }}
                              onClick={() => downloadClickHandler(o.id)}
                              disabled={apiSendState.isSending}
                            >
                              Download
                            </Button>
                            <Button
                              variant='contained'
                              size='small'
                              type='revoke'
                              disabled={apiSendState.isSending}
                              onClick={(event) =>
                                revokeCertHandler(event, o.id)
                              }
                            >
                              Revoke
                            </Button>
                          </>
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

// define props for linter
Orders.propTypes = {
  certId: PropTypes.string.isRequired,
  setHasValidOrders: PropTypes.func.isRequired,
  sendApiState: PropTypes.shape({
    isSending: PropTypes.bool,
    errorMessage: PropTypes.string,
  }).isRequired,
  sendData: PropTypes.func.isRequired,
};

export default Orders;
