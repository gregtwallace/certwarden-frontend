import { Link, useNavigate } from 'react-router-dom';

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

const Orders = (props) => {
  const [apiGetState] = useApiGet(
    `/v1/certificates/${props.certId}/orders`,
    'orders'
  );

  // TODO: New order button
  // TODO for existing orders: refresh option if state is ready or processing (tries to advance order)
  // & revoke button if the order is valid

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Orders'></H2Header>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>Created At</TableHeader>
              <TableHeader scope='col'>Expires</TableHeader>
              <TableHeader scope='col'>Status</TableHeader>
              <TableHeader scope='col'>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiGetState.orders &&
              apiGetState.orders.map((m) => (
                <TableRow key={m.id}>
                  <TableHeader scope='row'>{convertUnixTime(m.created_at)}</TableHeader>
                  <TableData>{convertUnixTime(m.expires)}</TableData>
                  <TableData>{m.status}</TableData>
                  <TableData>Button TODO</TableData>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </>
    );
  }
};

export default Orders;
