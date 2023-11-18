import { type FC } from 'react';
import {
  type certificatesResponseType,
  parseCertificatesResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { queryParser } from '../../UI/TableMui/query';
import { newId } from '../../../helpers/constants';

import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import ButtonAsLink from '../../UI/Button/ButtonAsLink';
import Flag from '../../UI/Flag/Flag';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../UI/TitleBar/TitleBar';
import TablePagination from '../../UI/TableMui/TablePagination';

const CERTIFICATES_URL = '/v1/certificates';

// table headers and sortable param
const tableHeaders: headerType[] = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    id: 'subject',
    label: 'Subject',
    sortable: true,
  },
  {
    id: 'flags',
    label: 'Flags',
    sortable: false,
  },
  {
    id: 'keyname',
    label: 'Key',
    sortable: true,
  },
  {
    id: 'accountname',
    label: 'Account',
    sortable: true,
  },
];

const AllCertificates: FC = () => {
  // parse query
  const [searchParams] = useSearchParams();
  const { page, rowsPerPage, queryParams } = queryParser(searchParams, 'name');

  const { getState } = useAxiosGet<certificatesResponseType>(
    `${CERTIFICATES_URL}?${queryParams}`,
    parseCertificatesResponseType
  );

  return (
    <TableContainer>
      <TitleBar title='Certificates'>
        <ButtonAsLink to={`/certificates/${newId}`}>
          New Certificate
        </ButtonAsLink>
      </TitleBar>

      {!getState.responseData && !getState.error && <ApiLoading />}

      {getState.error && (
        <ApiError
          statusCode={getState.error.statusCode}
          message={getState.error.message}
        />
      )}

      {getState.responseData && (
        <>
          <Table size='small'>
            <TableHead>
              <TableHeaderRow headers={tableHeaders} />
            </TableHead>
            <TableBody>
              {getState.responseData.certificates.length > 0 &&
                getState.responseData.certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/certificates/' + cert.id}
                      >
                        {cert.name}
                      </Link>
                    </TableCell>

                    <TableCell>{cert.subject}</TableCell>

                    <TableCell>
                      {cert.acme_account.acme_server.is_staging && (
                        <Flag type='staging' />
                      )}
                      {cert.api_key_via_url && <Flag type='legacy_api' />}
                    </TableCell>

                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/privatekeys/' + cert.private_key.id}
                      >
                        {cert.private_key.name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={'/acmeaccounts/' + cert.acme_account.id}
                      >
                        {cert.acme_account.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={getState.responseData.total_records}
          />
        </>
      )}
    </TableContainer>
  );
};

export default AllCertificates;
