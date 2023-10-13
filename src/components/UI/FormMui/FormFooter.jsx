import PropTypes from 'prop-types';
import { convertUnixTime } from '../../../helpers/time';

import { Box, Toolbar, Typography } from '@mui/material';

const FooterInfo = (props) => {
  return (
    <Typography variant='subtitle2' fontWeight='regular'>
      {props.children}
    </Typography>
  );
};

FooterInfo.propTypes = {
  children: PropTypes.node,
};

const FormFooter = (props) => {
  return (
    <Toolbar variant='dense' disableGutters sx={{ mt: 2, pr: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        {props.createdAt ? (
          <FooterInfo>Created: {convertUnixTime(props.createdAt)}</FooterInfo>
        ) : null}
        {props.updatedAt ? (
          <FooterInfo>
            Last Updated: {convertUnixTime(props.updatedAt)}
          </FooterInfo>
        ) : null}
        {props.checkedAt ? (
          <FooterInfo>
            Last Checked: {convertUnixTime(props.checkedAt, true)}
          </FooterInfo>
        ) : null}
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
