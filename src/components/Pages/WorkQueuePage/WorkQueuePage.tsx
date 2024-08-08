import { type FC } from 'react';
import {
  type queueResponseType,
  parseQueueResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { convertUnixTime } from '../../../helpers/time';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import FlagIdle from '../../UI/Flag/FlagIdle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCell } from '@mui/material';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TableRow from '@mui/material/TableRow';
import TitleBar from '../../UI/TitleBar/TitleBar';
import TableText from '../../UI/TableMui/TableText';

type propTypes = {
  apiUrl: string;
  description: string;
  helpUrl: string;
  queueName: string;
};

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

const WorkQueuePage: FC<propTypes> = (props) => {
  const { apiUrl, description, helpUrl, queueName } = props;

  const { getState } = useAxiosGet<queueResponseType>(
    apiUrl,
    parseQueueResponseType
  );

  return (
    <TableContainer>
      <TitleBar title={`${queueName} Queue`} helpURL={helpUrl} />

      <TableText>{description}</TableText>

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
            {Object.entries(getState.responseData.jobs_working).map(
              (workers) => {
                const [wId, wJob] = workers;

                return (
                  <TableRow key={wId}>
                    <TableCell>{wId}</TableCell>

                    <TableCell>{wJob ? wJob.order.id : <FlagIdle />}</TableCell>

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
                      {wJob ? (wJob.high_priority ? 'High' : 'Low') : ''}
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

export default WorkQueuePage;
