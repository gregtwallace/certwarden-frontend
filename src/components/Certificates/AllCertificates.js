import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';

import useAxiosGet from '../../hooks/useAxiosGet';
import { newId } from '../../App';

import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import Flag from '../UI/Flag/Flag';
import PaperSingle from '../Paper/PaperSingle';
import TitleBar from '../UI/Header/TitleBar';

const AllCertificates = () => {
  const navigate = useNavigate();

  const [apiGetState] = useAxiosGet('/v1/certificates', 'certificates', true);

  const newClickHandler = (event) => {
    event.preventDefault();
    navigate(`/certificates/${newId}`);
  };

  return (
    <PaperSingle>
      <TitleBar title='Certificates'>
        <Button variant='contained' type='submit' onClick={newClickHandler}>
          New Certificate
        </Button>
      </TitleBar>

      {!apiGetState.isLoaded && <ApiLoading />}
      {apiGetState.errorMessage && (
        <ApiError>{apiGetState.errorMessage}</ApiError>
      )}

      {apiGetState.isLoaded && !apiGetState.errorMessage && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Account</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiGetState.certificates.length > 0 &&
              apiGetState.certificates.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Link component={RouterLink} to={'/certificates/' + m.id}>
                      {m.name}
                    </Link>
                  </TableCell>
                  <TableCell>{m.subject}</TableCell>
                  <TableCell>
                    {!m.challenge_method.enabled && <Flag type='method' />}
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={'/privatekeys/' + m.private_key.id}
                    >
                      {m.private_key.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={'/acmeaccounts/' + m.acme_account.id}
                    >
                      {m.acme_account.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </PaperSingle>
  );
};

export default AllCertificates;
