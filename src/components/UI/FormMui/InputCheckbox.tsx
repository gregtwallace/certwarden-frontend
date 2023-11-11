import { type FC, type ReactNode } from 'react';
import { type inputHandlerFunc } from '../../../helpers/input-handler';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import fieldInformation from './fields-info';

type propTypes = {
  children: ReactNode;
  id: string;
  name?: string;
  checked: boolean;
  onChange: inputHandlerFunc;
  error?: boolean;
  disabled?: boolean;
};

const InputCheckbox: FC<propTypes> = (props) => {
  // destructure props
  const { checked, children, disabled, error, id, name, onChange } = props;

  // get field info
  const { errorMessage } = fieldInformation(name || id);

  return (
    <FormControl fullWidth sx={{ my: 1 }}>
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            name={name || id}
            onChange={(event, checked) => onChange(event, checked)}
            value={checked ? 'on' : 'off'}
            checked={!!checked}
            disabled={!!disabled}
          />
        }
        label={children}
      />
      {!!error && <FormHelperText error>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default InputCheckbox;
