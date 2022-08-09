import { Link, useNavigate } from 'react-router-dom';

import useApiGet from '../../hooks/useApiGet';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Table from '../UI/Table/Table';
import TableBody from '../UI/Table/TableBody';
import TableData from '../UI/Table/TableData';
import TableHead from '../UI/Table/TableHead';
import TableHeader from '../UI/Table/TableHeader';
import TableRow from '../UI/Table/TableRow';
import Button from '../UI/Button/Button';
import H2Header from '../UI/Header/H2Header';

const AllCertificates = () => {
  const navigate = useNavigate();

  const [apiGetState] = useApiGet('/v1/certificates', 'certificates');

  const newClickHandler = (event) => {
    event.preventDefault();
    navigate('-1');
  };

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Certificates'>
          <Button type='submit' onClick={newClickHandler}>
            New
          </Button>
        </H2Header>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope='col'>Name</TableHeader>
              <TableHeader scope='col'>Subject</TableHeader>
              <TableHeader scope='col'>Key</TableHeader>
              <TableHeader scope='col'>Account</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiGetState.certificates &&
              apiGetState.certificates.map((m) => (
                <TableRow key={m.id}>
                  <TableHeader scope='row'>
                    <Link to={'/certificates/' + m.id}>{m.name}</Link>
                  </TableHeader>
                  <TableData>{m.subject}</TableData>
                  <TableData>
                    <Link to={'/privatekeys/' + m.private_key.id}>
                      {m.private_key.name}
                    </Link>
                  </TableData>
                  <TableData>
                    <Link to={'/acmeaccounts/' + m.acme_account.id}>
                      {m.acme_account.name}
                    </Link>
                  </TableData>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </>
    );
  }
};

export default AllCertificates;
