import { type FC, type ReactNode } from 'react';
import { type ButtonProps as MuiButtonProps } from '@mui/material';

import Button from '../Button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// prop types
type propTypes = {
  children?: ReactNode;
  title: string;
  contentText: string;
  open: boolean;
  onCancel: MuiButtonProps['onClick'];
  onConfirm: MuiButtonProps['onClick'];
};

// component
const DialogAlert: FC<propTypes> = (props) => {
  const { children, contentText, open, onCancel, onConfirm, title } = props;

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
          {contentText}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
        }}
      >
        <Button color='info' onClick={onCancel}>
          Cancel
        </Button>
        <Button color='error' onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAlert;
