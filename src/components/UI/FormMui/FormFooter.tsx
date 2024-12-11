import { type FC, type MouseEventHandler, type ReactNode } from 'react';

import { Box, Toolbar, Typography } from '@mui/material';
import Button from '../Button/Button';
import ButtonAsLink from '../Button/ButtonAsLink';
import DateWithTooltip from '../DateWithTooltip/DateWithTooltip';

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
  lastAccess?: number;
  createdAt?: number;
  updatedAt?: number;

  cancelHref?: string;
  resetOnClick?: MouseEventHandler<HTMLButtonElement>;
  disabledAllButtons?: boolean;
  disabledResetButton?: boolean;
};

// component
const FormFooter: FC<propTypesFooter> = (props) => {
  const {
    cancelHref,
    createdAt,
    disabledAllButtons,
    disabledResetButton,
    lastAccess,
    resetOnClick,
    updatedAt,
  } = props;

  return (
    <Toolbar variant='dense' disableGutters sx={{ mt: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        {lastAccess !== undefined && (
          <FooterInfo>
            Last API Access: <DateWithTooltip unixTime={lastAccess} />
          </FooterInfo>
        )}

        {createdAt !== undefined && (
          <FooterInfo>
            Created: <DateWithTooltip unixTime={createdAt} />
          </FooterInfo>
        )}

        {updatedAt !== undefined && (
          <FooterInfo>
            Last Updated: <DateWithTooltip unixTime={updatedAt} />
          </FooterInfo>
        )}
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
          disabled={disabledAllButtons || disabledResetButton}
        >
          Reset
        </Button>
      )}

      <Button color='primary' type='submit' disabled={disabledAllButtons}>
        Submit
      </Button>
    </Toolbar>
  );
};

export default FormFooter;
