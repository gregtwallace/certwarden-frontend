import { Link, useNavigate } from 'react-router-dom';

import useAxiosGet from '../../hooks/useAxiosGet';

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

const AllACMEAccounts = () => {
  const navigate = useNavigate();

  const [ apiGetState ] = useAxiosGet('/v1/acmeaccounts', 'acme_accounts', true);

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
        <H2Header h2='ACME Accounts'>
          <Button type='submit' onClick={newClickHandler}>
            New
          </Button>
        </H2Header>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader scope='col'>Name</TableHeader>
            <TableHeader scope='col'>Description</TableHeader>
            <TableHeader scope='col'>Key</TableHeader>
            <TableHeader scope='col'>Status</TableHeader>
            <TableHeader scope='col'>Email</TableHeader>
            <TableHeader scope='col'>Type</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiGetState.acme_accounts && apiGetState.acme_accounts.map((m) => (
            <TableRow key={m.id}>
              <TableHeader scope='row'><Link to={"/acmeaccounts/" + m.id}>{m.name}</Link></TableHeader>
              <TableData>{m.description}</TableData>
              <TableData><Link to={"/privatekeys/" + m.private_key.id}>{m.private_key.name}</Link></TableData>
              <TableData>{m.status}</TableData>
              <TableData>{m.email}</TableData>
              <TableData>{m.is_staging ? "Staging" : "Production"}</TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
          }
};

export default AllACMEAccounts;
