import { Link as RouterLink, useSearchParams } from 'react-router-dom';
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
import TableHeader from '../UI/TableMui/TableHeader';
import TitleBar from '../UI/Header/TitleBar';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // get params
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const sort = searchParams.get('sort');

  // setup sorting vars
  let sortComponents;
  if (sort != null) {
    sortComponents = sort.split('.');
  }

  let orderBy = '';
  let order = '';
  if (sortComponents?.length === 2) {
    orderBy = sortComponents[0];
    order = sortComponents[1];
  } else {
    orderBy = 'valid_to';
    order = 'asc';
  }

  // if order is not asc or desc, set default
  if (order !== 'asc' && order !== 'desc') {
    order = 'asc';
  }

  const [apiGetState] = useAxiosGet(
    `/v1/orders/currentvalid?limit=${limit}&offset=${offset}&sort=${sort}`,
    'orders',
    true
  );

  // sort handler
  const setSortHandler = (headerId) => {
    // check if the headerId is for current sort
    // if so, reverse the order
    let newOrder = '';
    if (headerId === orderBy) {
      if (order === 'asc') {
        newOrder = 'desc';
      } else {
        newOrder = 'asc';
      }
    } else {
      // if changing col, default to asc
      newOrder = 'asc';
    }

    let newParams = searchParams;
    newParams.set('sort', `${headerId}.${newOrder}`);

    setSearchParams(newParams);
  };

  return (
    <PaperSingle>
      <TitleBar title='Dashboard' />

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {apiGetState.isLoaded && !apiGetState.errorMessage && (
        <>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableHeader
                  id='subject'
                  label='Subject'
                  orderBy={orderBy}
                  order={order}
                  onClick={setSortHandler}
                />
                <TableCell>Flags</TableCell>
                <TableHeader
                  id='name'
                  label='Name'
                  orderBy={orderBy}
                  order={order}
                  onClick={setSortHandler}
                />
                <TableHeader
                  id='valid_to'
                  label='Expiration (Remaining)'
                  orderBy={orderBy}
                  order={order}
                  onClick={setSortHandler}
                />
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
        </>
      )}
    </PaperSingle>
  );
};

export default Dashboard;
