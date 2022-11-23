import useAxiosGet from '../../hooks/useAxiosGet';

import { iso8601ToPretty } from '../../helpers/time';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Table from '../UI/Table/Table';
import TableBody from '../UI/Table/TableBody';
import TableData from '../UI/Table/TableData';
import TableHead from '../UI/Table/TableHead';
import TableHeader from '../UI/Table/TableHeader';
import TableRow from '../UI/Table/TableRow';
import H2Header from '../UI/Header/H2Header';

const LogViewer = () => {
  const [apiGetState] = useAxiosGet('/v1/logs', 'logs', true);

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Logs'></H2Header>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>Level</TableHeader>
              <TableHeader scope='col'>Time Stamp</TableHeader>
              <TableHeader scope='col'>Caller</TableHeader>
              <TableHeader scope='col'>Message</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {apiGetState.logs &&
              apiGetState.logs.map((m, i) => (
                <TableRow key={i}>
                  <TableData>{m.level}</TableData>
                  <TableData>{iso8601ToPretty(m.ts)}</TableData>
                  <TableData>{m.caller}</TableData>
                  <TableData>{m.msg}</TableData>
                </TableRow>
              )).reverse()}
          </TableBody>
        </Table>
      </>
    );
  }
};

export default LogViewer;
