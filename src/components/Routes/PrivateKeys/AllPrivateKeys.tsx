import { type FC } from 'react';
import {
  type privateKeysResponseType,
  parsePrivateKeysResponseType,
} from '../../../types/api';
import { type headerType } from '../../UI/TableMui/TableHeaderRow';

import { Link as RouterLink, useSearchParams } from 'react-router';
import { Link } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { TableCell } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import useAxiosGet from '../../../hooks/useAxiosGet';
import { queryParser } from '../../UI/TableMui/query';
import { newId } from '../../../helpers/constants';

import ApiLoading from '../../UI/Api/ApiLoading';
import ApiError from '../../UI/Api/ApiError';
import ButtonAsLink from '../../UI/Button/ButtonAsLink';
import DateWithTooltip from '../../UI/DateWithTooltip/DateWithTooltip';
import FlagAPIDisabled from '../../UI/Flag/FlagAPIDisabled';
import FlagLegacyAPI from '../../UI/Flag/FlagLegacyAPI';
import TableContainer from '../../UI/TableMui/TableContainer';
import TableHeaderRow from '../../UI/TableMui/TableHeaderRow';
import TitleBar from '../../UI/TitleBar/TitleBar';
import TablePagination from '../../UI/TableMui/TablePagination';

const PRIVATE_KEYS_URL = '/v1/privatekeys';

// table headers and sortable param
const tableHeaders: headerType[] = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    id: 'description',
    label: 'Description',
    sortable: true,
  },
  {
    id: 'flags',
    label: 'Flags',
    sortable: false,
  },
  {
    id: 'algorithm',
    label: 'Algorithm',
    sortable: true,
  },
  {
    id: 'last_access',
    label: 'Last API Access',
    sortable: true,
  },
];

const AllPrivateKeys: FC = () => {
  // parse query
  const [searchParams] = useSearchParams();
  const { page, rowsPerPage, queryParams } = queryParser(searchParams, 'name');

  const { getState } = useAxiosGet<privateKeysResponseType>(
    `${PRIVATE_KEYS_URL}?${queryParams}`,
    parsePrivateKeysResponseType
  );

  return (
    <TableContainer>
      <TitleBar
        title='Private Keys'
        helpURL='https://www.certwarden.com/docs/user_interface/private_keys/'
      >
        <ButtonAsLink to={`/privatekeys/${newId}`}>New Key</ButtonAsLink>
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
              {getState.responseData.private_keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <Link component={RouterLink} to={'/privatekeys/' + key.id}>
                      {key.name}
                    </Link>
                  </TableCell>
                  <TableCell>{key.description}</TableCell>
                  <TableCell>
                    {key.api_key_via_url && <FlagLegacyAPI />}
                    {key.api_key_disabled && <FlagAPIDisabled />}
                  </TableCell>
                  <TableCell>{key.algorithm.name}</TableCell>
                  <TableCell>
                    <DateWithTooltip unixTime={key.last_access} />
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

export default AllPrivateKeys;
