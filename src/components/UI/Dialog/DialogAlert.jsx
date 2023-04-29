import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DialogAlert = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      maxWidth='md'
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {props.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button onClick={props.onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

DialogAlert.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default DialogAlert;
