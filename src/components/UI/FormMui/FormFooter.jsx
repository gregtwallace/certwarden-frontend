import PropTypes from 'prop-types';
import { convertUnixTime } from '../../../helpers/time';

import { Box, Toolbar } from '@mui/material';

import FormInfo from './FormInfo';

const FormFooter = (props) => {
  return (
    <Toolbar variant='dense' disableGutters sx={{ mt: 2, pr: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        {props.createdAt && (
          <FormInfo>Created: {convertUnixTime(props.createdAt)}</FormInfo>
        )}
        {props.updatedAt && (
          <FormInfo>Last Updated: {convertUnixTime(props.updatedAt)}</FormInfo>
        )}
        {props.checkedAt && (
          <FormInfo>
            Last Checked: {convertUnixTime(props.checkedAt, true)}
          </FormInfo>
        )}
      </Box>
      {props.children}
    </Toolbar>
  );
};

FormFooter.propTypes = {
  createdAt: PropTypes.number,
  updatedAt: PropTypes.number,
  checkedAt: PropTypes.number,
  children: PropTypes.node,
};

export default FormFooter;
