import {
  type FC,
  type Dispatch,
  type MouseEventHandler,
  type SetStateAction,
} from 'react';
import {
  type ordersResponseType,
  parseOrdersResponseType,
  type orderResponseType,
  parseOrderResponseType,
  type orderPostProcessResponseType,
  parseOrderPostProcessResponseType,
} from '../../../../../types/api';
import { type frontendErrorType } from '../../../../../types/frontend';
import { type useAxiosSendReturnType } from '../../../../../hooks/useAxiosSend';
import { type headerType } from '../../../../UI/TableMui/TableHeaderRow';

import { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import useAxiosGet from '../../../../../hooks/useAxiosGet';
import { inputHandlerFuncMaker } from '../../../../../helpers/input-handler';
import { queryParser } from '../../../../UI/TableMui/query';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SubjectIcon from '@mui/icons-material/Subject';
import KeyIcon from '@mui/icons-material/Key';
import LinkIcon from '@mui/icons-material/Link';
import GroupIcon from '@mui/icons-material/Group';

import ApiLoading from '../../../../UI/Api/ApiLoading';
import ApiError from '../../../../UI/Api/ApiError';
import ApiSuccess from '../../../../UI/Api/ApiSuccess';
import Button from '../../../../UI/Button/Button';
import DateWithTooltip from '../../../../UI/DateWithTooltip/DateWithTooltip';
import DialogAlert from '../../../../UI/Dialog/DialogAlert';
import IconButton from '../../../../UI/Button/IconButton';
import IconButtonAsLink from '../../../../UI/Button/IconButtonAsLink';
import InputSelect from '../../../../UI/FormMui/InputSelect';
import TableContainer from '../../../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../../../UI/TitleBar/TitleBar';
import TablePagination from '../../../../UI/TableMui/TablePagination';

// table headers and sortable param
const tableHeaders: headerType[] = [
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
    id: 'details',
    label: 'Details',
    sortable: false,
  },
  {
    id: 'actions',
    label: 'Actions',
    sortable: false,
  },
];

// func for if a unix timestamp is expired
const isExpired = (unixTime: number): boolean => Date.now() / 1000 > unixTime;

// order type to use for status parsing
type orderStatusObj = {
  fulfillment_worker?: number | undefined;
  known_revoked: boolean;
  status: string;
  valid_to: number | null;
};

// object to hold revoke info
type revokeOrderRevokeFormType = {
  orderID: number;
  dataToSubmit: {
    reason_code: number;
  };
};

const closedOrderRevokeForm: revokeOrderRevokeFormType = {
  orderID: -1,
  dataToSubmit: {
    reason_code: 0,
  },
};

// revocation reason codes (see: RFC 5280 s. 5.3.1)
// some defined codes are not relevant and are thus omitted
const revocationReasonOptions = [
  {
    value: 0,
    name: 'Code 0: Unspecified',
  },
  {
    value: 1,
    name: 'Code 1: Key Compromise',
  },
  {
    value: 4,
    name: 'Code 4: Superseded',
  },
  {
    value: 5,
    name: 'Code 5: Cessation of Operation',
  },
  {
    value: 9,
    name: 'Code 9: Privilege Withdrawn',
  },
];

// calculate the order status value to display
const orderStatus = (order: orderStatusObj): string => {
  // if in order queue
  if (order.fulfillment_worker != undefined) {
    if (order.fulfillment_worker < 0) {
      return 'Waiting in Order Queue';
    }

    return 'With Order Worker ' + order.fulfillment_worker.toString();
  }

  // if revoked
  if (order.known_revoked) {
    return 'Revoked';
  }

  // if expired
  if (order.status === 'valid' && order.valid_to && isExpired(order.valid_to)) {
    return 'Expired';
  }

  // anything else
  return order.status.charAt(0).toUpperCase() + order.status.slice(1);
};

type propTypes = {
  certId: number;
  setHasValidOrders: Dispatch<SetStateAction<boolean>>;
  useAxiosSend: useAxiosSendReturnType;
  disableButtons: boolean;
  certHasPostProcessing: boolean;
};

const Orders: FC<propTypes> = (props) => {
  const {
    certId,
    certHasPostProcessing,
    setHasValidOrders,
    useAxiosSend,
    disableButtons,
  } = props;

  // parse query
  const [searchParams] = useSearchParams();
  const { page, rowsPerPage, queryParams } = queryParser(
    searchParams,
    'created_at',
    'desc',
    'orders'
  );

  const { getState, updateGet } = useAxiosGet<ordersResponseType>(
    `/v1/certificates/${certId.toString()}/orders?${queryParams}`,
    parseOrdersResponseType
  );

  // set parent's hasValidOrders
  useEffect(() => {
    // func for if an order is usable (i.e. 'valid' + not revoked + not expired)
    const isUsable = (order: orderStatusObj): boolean =>
      order.status === 'valid' &&
      !order.known_revoked &&
      order.valid_to !== null &&
      !isExpired(order.valid_to);

    // check if any orders, and if any are usable
    if (
      getState.responseData &&
      getState.responseData.orders.length > 0 &&
      getState.responseData.orders.some(isUsable)
    ) {
      setHasValidOrders(true);
    } else {
      // no usable orders
      setHasValidOrders(false);
    }
  }, [setHasValidOrders, getState]);

  // action handlers
  // Rather than making another sendApi, use the parent component's.
  // This allows disabling the parent's buttons also
  const { axiosSendState, apiCall, downloadFile } = useAxiosSend;

  // states for send success / error
  const [sendResult, setSendResultState] = useState<string | undefined>();
  const [sendError, setSendError] = useState<frontendErrorType | undefined>(
    undefined
  );

  // trigger post processing
  // download order pem
  const postProcessClickHandler = (orderId: number): void => {
    apiCall<orderPostProcessResponseType>(
      'POST',
      `/v1/certificates/${certId.toString()}/orders/${orderId.toString()}/postprocess`,
      {},
      parseOrderPostProcessResponseType
    ).then(({ responseData, error }): void => {
      setSendResultState(
        responseData && 'Post processing triggered. Check the logs for results.'
      );
      setSendError(error);
    });
  };

  // download order pem
  const downloadClickHandler = (orderId: number): void => {
    downloadFile(
      `/v1/certificates/${certId.toString()}/orders/${orderId.toString()}/download`
    ).then(({ error }) => {
      setSendResultState(undefined);
      setSendError(error);
    });
  };

  // handler to place a new order
  const newOrderHandler = (): void => {
    apiCall<orderResponseType>(
      'POST',
      `/v1/certificates/${certId.toString()}/orders`,
      {},
      parseOrderResponseType
    ).then(({ error }) => {
      setSendResultState(undefined);
      setSendError(error);
      updateGet();
    });
  };

  // handler to retry an existing order that isn't valid or invalid
  const retryOrderHandler = (orderId: number): void => {
    apiCall<orderResponseType>(
      'POST',
      `/v1/certificates/${certId.toString()}/orders/${orderId.toString()}`,
      {},
      parseOrderResponseType
    ).then(({ error }) => {
      setSendResultState(undefined);
      setSendError(error);
      updateGet();
    });
  };

  // handler to revoke a valid order's certificate
  const [revokeOrderForm, setRevokeOrderForm] = useState(closedOrderRevokeForm);
  const revokeInputChangeHandler = inputHandlerFuncMaker(setRevokeOrderForm);

  const revokeOrderConfirmHandler: MouseEventHandler = () => {
    // save params for submission and close form
    const orderID = revokeOrderForm.orderID;
    const toSubmit = revokeOrderForm.dataToSubmit;
    setRevokeOrderForm(closedOrderRevokeForm);

    // send POST
    apiCall<orderResponseType>(
      'POST',
      `/v1/certificates/${certId.toString()}/orders/${orderID.toString()}/revoke`,
      toSubmit,
      parseOrderResponseType
    ).then(({ error }) => {
      setSendResultState(undefined);
      setSendError(error);
      updateGet();
    });
  };
  // action handlers -- end

  const disableAllButtons = axiosSendState.isSending || disableButtons;

  return (
    <TableContainer>
      <TitleBar
        title='ACME Orders'
        headerComponent='h3'
        helpURL='https://www.certwarden.com/docs/user_interface/certificates/#acme-orders'
      >
        {getState.responseData && (
          <Button
            size='small'
            disabled={disableAllButtons}
            onClick={newOrderHandler}
          >
            Place New Order
          </Button>
        )}
      </TitleBar>

      {!getState.responseData && !getState.error && <ApiLoading />}

      {getState.error && (
        <ApiError
          statusCode={getState.error.statusCode}
          message={getState.error.message}
        />
      )}

      {sendError && (
        <ApiError
          statusCode={sendError.statusCode}
          message={sendError.message}
        />
      )}

      {sendResult && <ApiSuccess>{sendResult}</ApiSuccess>}

      {getState.responseData && (
        <>
          <DialogAlert
            title={`Are you sure you want to revoke the selected order?`}
            contentText='This action cannot be undone.'
            open={revokeOrderForm.orderID !== -1}
            onCancel={() => {
              setRevokeOrderForm(closedOrderRevokeForm);
            }}
            onConfirm={revokeOrderConfirmHandler}
          >
            <br />
            <InputSelect
              id='dataToSubmit.reason_code'
              label='Revocation Reason'
              value={revokeOrderForm.dataToSubmit.reason_code}
              onChange={revokeInputChangeHandler}
              options={revocationReasonOptions}
            />
          </DialogAlert>

          <Table size='small'>
            <TableHead>
              <TableHeaderRow headers={tableHeaders} />
            </TableHead>

            <TableBody>
              {getState.responseData.orders.map((ord) => (
                <TableRow key={ord.id}>
                  <TableCell>
                    <DateWithTooltip unixTime={ord.created_at} />
                  </TableCell>

                  <TableCell>
                    <DateWithTooltip unixTime={ord.valid_to} />
                  </TableCell>

                  <TableCell>{orderStatus(ord)}</TableCell>

                  {/* Details Column */}
                  <TableCell>
                    <IconButton
                      tooltip={
                        <>
                          DNS Identifiers: <br />
                          {ord.dns_identifiers.map((id, indx) => (
                            <Fragment key={indx}>
                              {id} <br />
                            </Fragment>
                          ))}
                        </>
                      }
                    >
                      <SubjectIcon />
                    </IconButton>

                    {ord.finalized_key && (
                      <IconButtonAsLink
                        to={`/privatekeys/${ord.finalized_key.id.toString()}`}
                        tooltip={
                          <>
                            Key: <br />
                            {ord.finalized_key.name}
                          </>
                        }
                      >
                        <KeyIcon />
                      </IconButtonAsLink>
                    )}

                    {ord.chain_root_cn && (
                      <IconButton
                        tooltip={
                          <>
                            Root Cert CN: <br />
                            {ord.chain_root_cn}
                          </>
                        }
                      >
                        <LinkIcon />
                      </IconButton>
                    )}

                    {ord.profile && (
                      <IconButton
                        tooltip={
                          <>
                            Profile: <br />
                            {ord.profile}
                          </>
                        }
                      >
                        <GroupIcon />
                      </IconButton>
                    )}
                  </TableCell>

                  <TableCell>
                    {ord.status !== 'valid' &&
                      ord.status !== 'invalid' &&
                      ord.fulfillment_worker === undefined && (
                        <Button
                          size='small'
                          color='info'
                          disabled={disableAllButtons}
                          onClick={(_event) => {
                            retryOrderHandler(ord.id);
                          }}
                        >
                          Retry
                        </Button>
                      )}

                    {ord.status === 'valid' &&
                      !ord.known_revoked &&
                      ord.valid_to !== null &&
                      !isExpired(ord.valid_to) && (
                        <>
                          <Button
                            size='small'
                            color='primary'
                            sx={{ mr: 1 }}
                            onClick={() => {
                              downloadClickHandler(ord.id);
                            }}
                            disabled={disableAllButtons}
                          >
                            Download
                          </Button>

                          <Button
                            size='small'
                            color='error'
                            disabled={disableAllButtons}
                            onClick={() => {
                              setRevokeOrderForm({
                                orderID: ord.id,
                                dataToSubmit: {
                                  reason_code: 0,
                                },
                              });
                            }}
                          >
                            Revoke
                          </Button>

                          {certHasPostProcessing && ord.finalized_key && (
                            <Button
                              size='small'
                              color='info'
                              sx={{ mr: 1 }}
                              onClick={() => {
                                postProcessClickHandler(ord.id);
                              }}
                              disabled={disableAllButtons}
                            >
                              Post Process
                            </Button>
                          )}
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
            count={getState.responseData.total_records}
            storageSuffix='orders'
          />
        </>
      )}
    </TableContainer>
  );
};

export default Orders;
