import { type FC } from 'react';
import {
  type orderQueueResponseType,
  parseOrderQueueResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

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
import TableText from '../../UI/TableMui/TableText';

const ORDER_QUEUE_URL = '/v1/orders/fulfiller/status';

// table headers
const tableHeaders: headerType[] = [
  {
    id: 'workerid',
    label: 'Worker ID',
    sortable: false,
  },
  {
    id: 'orderid',
    label: 'Order ID',
    sortable: false,
  },
  {
    id: 'certificiatename',
    label: 'Certificate Name',
    sortable: false,
  },
  {
    id: 'addedtoqueue',
    label: 'Added To Queue',
    sortable: false,
  },
  {
    id: 'priority',
    label: 'Priority',
    sortable: false,
  },
  {
    id: 'certificatesubject',
    label: 'Subject',
    sortable: false,
  },
];

const OrderQueue: FC = () => {
  const { getState } = useAxiosGet<orderQueueResponseType>(
    ORDER_QUEUE_URL,
    parseOrderQueueResponseType
  );

  return (
    <TableContainer>
      <TitleBar title='Order Queue' />

      <TableText>
        The Order Queue shows all active orders that LeGo is working on. If an
        order is assigned to a Worker ID, that order is being actively worked
        with the ACME server. If an order does not have a Worker ID, it is
        queued up and waiting to be worked once a worker becomes available.
      </TableText>

      {!getState.responseData && !getState.error && <ApiLoading />}

      {getState.error && (
        <ApiError
          statusCode={getState.error.statusCode}
          message={getState.error.message}
        />
      )}

      {getState.responseData && (
        <Table size='small'>
          <TableHead>
            <TableHeaderRow headers={tableHeaders} />
          </TableHead>

          <TableBody>
            {/* Workers */}
            {Object.entries(getState.responseData.worker_jobs).map(
              (workers) => {
                const [wId, wJob] = workers;

                return (
                  <TableRow key={wId}>
                    <TableCell>{wId}</TableCell>

                    <TableCell>
                      {wJob ? wJob.order.id : <Flag type='idle' />}
                    </TableCell>

                    <TableCell>
                      {wJob && (
                        <Link
                          component={RouterLink}
                          to={'/certificates/' + wJob.order.certificate.id}
                        >
                          {wJob.order.certificate.name}
                        </Link>
                      )}
                    </TableCell>

                    <TableCell>
                      {wJob && convertUnixTime(wJob.added_to_queue, true)}
                    </TableCell>

                    <TableCell>
                      {wJob && wJob.high_priority ? 'High' : 'Low'}
                    </TableCell>

                    <TableCell>
                      {wJob && wJob.order.certificate.subject}
                    </TableCell>
                  </TableRow>
                );
              }
            )}

            {/* Waiting */}
            {getState.responseData.jobs_waiting.map((job) => {
              return (
                <TableRow key={job.order.id}>
                  <TableCell>None (Waiting)</TableCell>

                  <TableCell>{job.order.id}</TableCell>

                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={'/certificates/' + job.order.certificate.id}
                    >
                      {job.order.certificate.name}
                    </Link>
                  </TableCell>

                  <TableCell>
                    {convertUnixTime(job.added_to_queue, true) || ''}
                  </TableCell>

                  <TableCell>{job.high_priority ? 'High' : 'Low'}</TableCell>

                  <TableCell>{job.order.certificate.subject || ''}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default OrderQueue;
