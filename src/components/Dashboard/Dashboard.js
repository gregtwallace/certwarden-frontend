import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useAxiosGet from '../../hooks/useAxiosGet';
import { convertUnixTime, daysUntil } from '../../helpers/time';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Flag from '../UI/Flag/Flag';
import PaperSingle from '../UI/Paper/PaperSingle';
import TitleBar from '../UI/Header/TitleBar';

const Dashboard = () => {
  const [apiGetState] = useAxiosGet('/v1/orders/currentvalid', 'orders', true);

  return (
    <PaperSingle>
      <TitleBar title='Dashboard' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {apiGetState.isLoaded && !apiGetState.errorMessage && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Expiration (Remaining)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiGetState.orders?.length > 0 &&
              apiGetState.orders.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.certificate.subject}</TableCell>
                  <TableCell>
                    {m.certificate.acme_account.is_staging && (
                      <Flag type='staging' />
                    )}
                    {!m.certificate.challenge_method.enabled && (
                      <Flag type='method' />
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={'/certificates/' + m.certificate.id}
                    >
                      {m.certificate.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {convertUnixTime(m.valid_to)}{' '}
                    <Flag type='expire-days' days={daysUntil(m.valid_to)} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </PaperSingle>
  );
};

export default Dashboard;
