import { Link } from 'react-router-dom';

import useApiGet from '../../../../hooks/useApiGet';
import { convertUnixTime } from '../../../../helpers/unix-time';

import ApiLoading from '../../../UI/Api/ApiLoading';
import ApiError from '../../../UI/Api/ApiError';
import Table from '../../../UI/Table/Table';
import TableBody from '../../../UI/Table/TableBody';
import TableData from '../../../UI/Table/TableData';
import TableHead from '../../../UI/Table/TableHead';
import TableHeader from '../../../UI/Table/TableHeader';
import TableRow from '../../../UI/Table/TableRow';
import H2Header from '../../../UI/Header/H2Header';
import Button from '../../../UI/Button/Button';

const Orders = (props) => {
  const [apiGetState, updateGet] = useApiGet(
    `/v1/certificates/${props.certId}/orders`,
    'orders'
  );

  // Rather than making another sendApi, use the parent component's.
  // This allows disabling the parent's buttons also
  const [sendApiState, sendData] = [props.sendApiState, props.sendData];

  // handler to place a new order
  const newOrderHandler = (event) => {
    sendData(`/v1/certificates/${props.certId}/orders`, 'POST').then(
      (success) => {
        updateGet();
      }
    );
  };

  // handler to retry an existing order that isn't valid or invalid
  const retryOrderHandler = (event, orderId) => {
    event.preventDefault();

    sendData(`/v1/certificates/${props.certId}/orders/${orderId}`, 'POST').then(
      (success) => {
        updateGet();
      }
    );
  };

  // handler to revoke a valid order's certificate
  const revokeCertHandler = (event, orderId) => {
    event.preventDefault();

    // TODO: add ability to specify revocation reason
    sendData(
      `/v1/certificates/${props.certId}/orders/${orderId}/revoke`,
      'POST'
    ).then((success) => {
      updateGet();
    });
  };

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Orders'>
          <Button
            type='primary'
            disabled={sendApiState.isSending}
            onClick={newOrderHandler}
          >
            Place New Order
          </Button>
        </H2Header>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>Created At</TableHeader>
              <TableHeader scope='col'>Valid To</TableHeader>
              <TableHeader scope='col'>Status</TableHeader>
              <TableHeader scope='col'>Private Key</TableHeader>
              <TableHeader scope='col'>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiGetState.orders &&
              apiGetState.orders.map((m) => (
                <TableRow key={m.id}>
                  <TableHeader scope='row'>
                    {convertUnixTime(m.created_at)}
                  </TableHeader>
                  <TableData>{convertUnixTime(m.valid_to)}</TableData>
                  <TableData>
                    {m.known_revoked ? 'revoked' : m.status}
                  </TableData>
                  <TableData>
                    {m.finalized_key && (
                      <Link to={`/privatekeys/${m.finalized_key.id}`}>
                        {m.finalized_key.name}
                      </Link>
                    )}
                  </TableData>
                  <TableData>
                    {m.status !== 'valid' && m.status !== 'invalid' && (
                      <Button
                        type='secondary'
                        disabled={sendApiState.isSending}
                        onClick={(event) => retryOrderHandler(event, m.id)}
                      >
                        Retry
                      </Button>
                    )}
                    {m.status === 'valid' &&
                      !m.known_revoked &&
                      Date.now() / 1000 < m.valid_to && (
                        <Button
                          type='revoke'
                          disabled={sendApiState.isSending}
                          onClick={(event) => revokeCertHandler(event, m.id)}
                        >
                          Revoke
                        </Button>
                      )}
                  </TableData>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </>
    );
  }
};

export default Orders;
