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

// Component for expiration times / formatting
const Expiration = (props) => {
  // do some formatting if certs are nearing EoL
  var daysToExp = daysUntil(props.valid_to);
  var classes = 'font-weight-bold';

  switch (true) {
    // 30 days left
    case daysToExp <= 30:
      classes += ' bg-danger text-white';
      break;

    // 40 days left
    case daysToExp <= 40:
      classes += ' text-danger';
      break;

    default:
      classes += ' text-info';
      break;
  }

  return (
    <>
      {convertUnixTime(props.valid_to) + ' '}
      <span className={classes}>{'(' + daysToExp + ' Days)'}</span>
    </>
  );
};

// Main Dashboard
const Dashboard = () => {
  const [apiGetState] = useAxiosGet('/v1/orders/currentvalid', 'orders', true);

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Dashboard'></H2Header>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>Subject</TableHeader>
              <TableHeader scope='col'></TableHeader>
              <TableHeader scope='col'>Name</TableHeader>
              <TableHeader scope='col'>Expiration (Until)</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiGetState.orders &&
              apiGetState.orders.map((m) => (
                <TableRow key={m.id}>
                  <TableHeader>
                    {m.certificate.subject}{' '}
                  </TableHeader>
                  <TableData>
                  {m.certificate.acme_account.is_staging && (
                      <span className='text-info'>(Staging)</span>
                    )}
                  </TableData>
                  <TableData scope='row'>
                    <Link to={'/certificates/' + m.certificate.id}>
                      {m.certificate.name}
                    </Link>
                  </TableData>
                  <TableData>
                    <Expiration valid_to={m.valid_to} />
                  </TableData>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </>
    );
  }
};

export default Dashboard;
