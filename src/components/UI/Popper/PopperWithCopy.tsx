import type { FC, MouseEventHandler } from 'react';
import type { SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';

import { useState } from 'react';

import { styled, css } from '@mui/system';
import { Popper as MuiPopper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import IconButton from '../Button/IconButton';

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledPopperDiv = styled('div')(
  ({ theme }) => css`
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: ${theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`};
    padding: 0.75rem;
    color: ${theme.palette.mode === 'dark' ? grey[100] : grey[700]};
    font-size: 0.875rem;
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    opacity: 1;
    margin: 0.25rem 0;
  `
);

type propTypes = {
  content: string;
  Icon: OverridableComponent<SvgIconTypeMap>;
};

const PopperWithCopy: FC<propTypes> = (props) => {
  const { content, Icon } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // click pop button
  const clickHandler: MouseEventHandler = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // click copy button (copies and closes popper)
  const handleCopyClick: MouseEventHandler = () => {
    setAnchorEl(null);
    navigator.clipboard.writeText(content);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={clickHandler} tooltip='Click to View'>
        <Icon fontSize='small' />
      </IconButton>
      <MuiPopper open={open} anchorEl={anchorEl} placement='right'>
        <StyledPopperDiv>
          {content}
          <IconButton
            onClick={handleCopyClick}
            tooltip='Copy & Close'
            sx={{
              p: 0,
              ml: 2,
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </StyledPopperDiv>
      </MuiPopper>
    </>
  );
};

export default PopperWithCopy;
