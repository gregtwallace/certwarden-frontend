import useAxiosGet from '../../../hooks/useAxiosGet';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { convertUnixTime } from '../../../helpers/time';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import Flag from '../../UI/Flag/Flag';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCell } from '@mui/material';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TableRow from '@mui/material/TableRow';
import TitleBar from '../../UI/TitleBar/TitleBar';

// table headers
const tableHeaders = [
  {
    id: 'workerid',
    label: 'Worker ID',
  },
  {
    id: 'orderid',
    label: 'Order ID',
  },
  {
    id: 'certificiatename',
    label: 'Certificate Name',
  },
  {
    id: 'placedat',
    label: 'Placed At',
  },
  {
    id: 'priority',
    label: 'Priority',
  },
  {
    id: 'certificatesubject',
    label: 'Subject',
  },
];

const OrderQueue = () => {
  const [apiGetState] = useAxiosGet(
    '/v1/orders/fulfiller/status',
    'work_status',
    true
  );

  return (
    <TableContainer>
      <TitleBar title='Order Queue' />

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
              {/* Workers */}
              {Object.keys(apiGetState?.work_status?.worker_jobs || {}).length >
                0 &&
                Object.entries(apiGetState.work_status.worker_jobs).map(
                  (workers) => {
                    const [key, val] = workers;

                    return (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>

                        <TableCell>{val?.order.id || ''}</TableCell>

                        <TableCell>
                          {val?.order.certificate.name ? (
                            <Link
                              component={RouterLink}
                              to={'/certificates/' + val.order.certificate.id}
                            >
                              {val.order.certificate.name}
                            </Link>
                          ) : (
                            <Flag type='idle' />
                          )}
                        </TableCell>

                        <TableCell>
                          {convertUnixTime(val?.placed_at, true) || ''}
                        </TableCell>

                        <TableCell>
                          {val?.high_priority != undefined
                            ? val.high_priority
                              ? 'High'
                              : 'Low'
                            : ''}
                        </TableCell>

                        <TableCell>
                          {val?.order.certificate.subject || ''}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}

              {/* Waiting */}
              {apiGetState?.work_status?.jobs_waiting.length > 0 &&
                apiGetState.work_status.jobs_waiting.map((job) => {
                  return (
                    <TableRow key={job.order.id}>
                      <TableCell>None (Waiting)</TableCell>

                      <TableCell>{job.order.id}</TableCell>

                      <TableCell>
                        {job.order.certificate.name ? (
                          <Link
                            component={RouterLink}
                            to={'/certificates/' + job.order.certificate.id}
                          >
                            {job.order.certificate.name}
                          </Link>
                        ) : (
                          <Flag type='idle' />
                        )}
                      </TableCell>

                      <TableCell>
                        {convertUnixTime(job.placed_at, true) || ''}
                      </TableCell>

                      <TableCell>
                        {job.high_priority ? 'High' : 'Low'}
                      </TableCell>

                      <TableCell>
                        {job.order.certificate.subject || ''}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </>
      )}
    </TableContainer>
  );
};

export default OrderQueue;
