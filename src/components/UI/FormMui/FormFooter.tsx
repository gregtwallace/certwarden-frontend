import { type FC, type MouseEventHandler, type ReactNode } from 'react';

import { convertUnixTime } from '../../../helpers/time';

import { Box, Toolbar, Typography } from '@mui/material';
import Button from '../Button/Button';
import ButtonAsLink from '../Button/ButtonAsLink';

// prop types (subcomponent)
type propTypesInfo = {
  children: ReactNode;
};

// subcomponent
const FooterInfo: FC<propTypesInfo> = (props) => {
  const { children } = props;

  return (
    <Typography variant='subtitle2' fontWeight='regular'>
      {children}
    </Typography>
  );
};

// prop types
type propTypesFooter = {
  createdAt?: number;
  updatedAt?: number;

  cancelHref?: string;
  resetOnClick?: MouseEventHandler<HTMLButtonElement>;
  disabledAllButtons?: boolean;
  disabledSubmitResetButtons?: boolean;
};

// component
const FormFooter: FC<propTypesFooter> = (props) => {
  const {
    cancelHref,
    createdAt,
    disabledAllButtons,
    disabledSubmitResetButtons,
    resetOnClick,
    updatedAt,
  } = props;

  return (
    <Toolbar variant='dense' disableGutters sx={{ mt: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        {createdAt ? (
          <FooterInfo>Created: {convertUnixTime(createdAt)}</FooterInfo>
        ) : null}

        {updatedAt ? (
          <FooterInfo>Last Updated: {convertUnixTime(updatedAt)}</FooterInfo>
        ) : null}
      </Box>

      {cancelHref && (
        <ButtonAsLink
          color='secondary'
          to={cancelHref}
          disabled={disabledAllButtons}
        >
          Cancel
        </ButtonAsLink>
      )}

      {resetOnClick && (
        <Button
          color='info'
          onClick={resetOnClick}
          disabled={disabledAllButtons || disabledSubmitResetButtons}
        >
          Reset
        </Button>
      )}

      <Button
        color='primary'
        type='submit'
        disabled={disabledAllButtons || disabledSubmitResetButtons}
      >
        Submit
      </Button>
    </Toolbar>
  );
};

export default FormFooter;
