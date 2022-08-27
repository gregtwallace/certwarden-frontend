import { Link } from 'react-router-dom';

import useAxiosGet from '../../hooks/useAxiosGet';
import { convertUnixTime, daysUntil } from '../../helpers/unix-time';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Table from '../UI/Table/Table';
import TableBody from '../UI/Table/TableBody';
import TableData from '../UI/Table/TableData';
import TableHead from '../UI/Table/TableHead';
import TableHeader from '../UI/Table/TableHeader';
import TableRow from '../UI/Table/TableRow';
import H2Header from '../UI/Header/H2Header';

const Dashboard = () => {
  const [apiGetState] = useAxiosGet('/v1/orders/currentvalid', 'orders', true);


  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Dashboard'>
        </H2Header>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>Subject</TableHeader>
              <TableHeader scope='col'>Name</TableHeader>
              <TableHeader scope='col'>Expiration (Until)</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiGetState.orders &&
              apiGetState.orders.map((m) => (
                <TableRow key={m.id}>
                  <TableHeader>{m.certificate.subject} {m.certificate.acme_account.is_staging && <span className="text-info">(Staging)</span>}</TableHeader>
                  <TableData scope='row'>
                    <Link to={'/certificates/' + m.certificate.id}>{m.certificate.name}</Link>
                  </TableData>
                  <TableData>
                    {convertUnixTime(m.valid_to) + " (" + daysUntil(m.valid_to) + " Days)"} 
                  </TableData>
                </TableRow>
              ))
              }
          </TableBody>
        </Table>
      </>
    );
  }
};

export default Dashboard;
