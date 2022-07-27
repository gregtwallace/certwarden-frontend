import { Link, useNavigate } from 'react-router-dom';

import useApiGet from '../../../../hooks/useApiGet';

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
  const [apiGetState] = useApiGet(`/v1/certificates/${props.id}/orders`, 'orders');

  // logic for orders
  // TODO

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Orders'>
        </H2Header>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>TODO</TableHeader>
              <TableHeader scope='col'>TODO</TableHeader>
              <TableHeader scope='col'>TODO</TableHeader>
              <TableHeader scope='col'>TODO</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiGetState.orders &&
              apiGetState.orders.map((m) => (
                <TableRow key={m.id}>
                  <TableHeader scope='row'>

                  </TableHeader>
                  <TableData>{m.subject}</TableData>
                  <TableData>

                  </TableData>
                  <TableData>

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
