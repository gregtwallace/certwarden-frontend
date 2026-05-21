import { type ChangeEvent, type FC } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type propTypes = {
  value: string;
  onChange: (newValue: string) => void;
  resultCount?: number;
  placeholder?: string;
};

const TableSearch: FC<propTypes> = (props) => {
  const { onChange, placeholder = 'Search…', resultCount, value } = props;

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  const clearHandler = (): void => {
    onChange('');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
      <TextField
        size='small'
        value={value}
        onChange={changeHandler}
        placeholder={placeholder}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            ),
            endAdornment: value !== '' && (
              <InputAdornment position='end'>
                <IconButton
                  size='small'
                  onClick={clearHandler}
                  aria-label='clear search'
                >
                  <ClearIcon fontSize='small' />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      {value !== '' && resultCount !== undefined && (
        <Typography variant='caption' color='text.secondary'>
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </Typography>
      )}
    </Box>
  );
};

export default TableSearch;
