import { type IFuseOptions } from 'fuse.js';
import { type FC, useState } from 'react';
import {
  type certificatesResponseType,
  parseCertificatesResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

import { Link as RouterLink, useSearchParams } from 'react-router';

import { newId } from '../../../helpers/constants';
import useAxiosGet from '../../../hooks/useAxiosGet';
import { queryParser } from '../../UI/TableMui/query';

import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useDebounce from '../../../hooks/useDebounce';
import useFuseSearch from '../../../hooks/useFuseSearch';
import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import ButtonAsLink from '../../UI/Button/ButtonAsLink';
import DateWithTooltip from '../../UI/DateWithTooltip/DateWithTooltip';
import FlagLegacyAPI from '../../UI/Flag/FlagLegacyAPI';
import FlagStaging from '../../UI/Flag/FlagStaging';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TablePagination from '../../UI/TableMui/TablePagination';
import TableSearch from '../../UI/TableMui/TableSearch';
import TitleBar from '../../UI/TitleBar/TitleBar';

const CERTIFICATES_URL = '/v1/certificates';

const fuseOptions: IFuseOptions<certificatesResponseType['certificates'][number]> = {
  keys: ['name', 'subject', 'private_key.name', 'acme_account.name'],
  threshold: 0.3,
};

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
  {
    id: 'last_access',
    label: 'Last API Access',
    sortable: true,
  },
];

const AllCertificates: FC = () => {
  // parse query
  const [searchParams] = useSearchParams();
  const { page, rowsPerPage, queryParams } = queryParser(searchParams, 'name');

  // fuzzy search state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  // when search is active, fetch all records; otherwise use normal paginated fetch
  const fetchUrl =
    debouncedSearchTerm !== ''
      ? `${CERTIFICATES_URL}?limit=0&sort=name.asc`
      : `${CERTIFICATES_URL}?${queryParams}`;

  const { getState } = useAxiosGet<certificatesResponseType>(
    fetchUrl,
    parseCertificatesResponseType
  );

  const allCertificates = getState.responseData?.certificates ?? [];
  const filteredCertificates = useFuseSearch(
    allCertificates,
    debouncedSearchTerm,
    fuseOptions
  );

  const isSearchActive = debouncedSearchTerm !== '';
  const displayedCertificates = isSearchActive
    ? filteredCertificates.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    : allCertificates;
  const totalCount = isSearchActive
    ? filteredCertificates.length
    : (getState.responseData?.total_records ?? 0);

  return (
    <TableContainer>
      <TitleBar
        title='Certificates'
        helpURL='https://www.certwarden.com/docs/user_interface/certificates/'
      >
        <ButtonAsLink to={`/certificates/${newId.toString()}`}>
          New Certificate
        </ButtonAsLink>
      </TitleBar>

      <TableSearch
        value={searchTerm}
        onChange={setSearchTerm}
        {...(isSearchActive ? { resultCount: filteredCertificates.length } : {})}
      />

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
              {displayedCertificates.length === 0 && isSearchActive && (
                <TableRow>
                  <TableCell colSpan={tableHeaders.length} align='center'>
                    No certificates match &ldquo;{debouncedSearchTerm}&rdquo;
                  </TableCell>
                </TableRow>
              )}
              {displayedCertificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={'/certificates/' + cert.id.toString()}
                    >
                      {cert.name}
                    </Link>
                  </TableCell>

                  <TableCell>{cert.subject}</TableCell>

                  <TableCell>
                    {cert.acme_account.acme_server.is_staging && (
                      <FlagStaging />
                    )}
                    {cert.api_key_via_url && <FlagLegacyAPI />}
                  </TableCell>

                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={'/privatekeys/' + cert.private_key.id.toString()}
                    >
                      {cert.private_key.name}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={'/acmeaccounts/' + cert.acme_account.id.toString()}
                    >
                      {cert.acme_account.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <DateWithTooltip unixTime={cert.last_access} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalCount}
          />
        </>
      )}
    </TableContainer>
  );
};

export default AllCertificates;
