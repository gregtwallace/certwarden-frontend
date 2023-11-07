import { type FC, type ReactNode } from 'react';
import { type ButtonProps as MuiButtonProps } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '../Button/Button';

// prop types
type propTypes = {
  children: ReactNode;
  title: string;
  open: boolean;
  onCancel: MuiButtonProps['onClick'];
  onConfirm: MuiButtonProps['onClick'];
};

// component
const DialogAlert: FC<propTypes> = (props) => {
  const { children, open, onCancel, onConfirm, title } = props;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth='md'
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='info' onClick={onCancel}>
          Cancel
        </Button>
        <Button color='warning' onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAlert;
