import { type FC } from 'react';
import {
  type inputHandlerFunc,
  type selectInputOptionValuesType,
  type selectInputOption,
} from '../../../helpers/input-handler';

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import fieldInformation from './fields-info';

type propTypes = {
  id: string;
  name?: string;
  label: string;
  value: selectInputOptionValuesType;
  onChange: inputHandlerFunc;
  options: selectInputOption[];
  error?: boolean | undefined;
  readOnly?: boolean;
  disabled?: boolean;
};

const InputSelect: FC<propTypes> = (props) => {
  // destructure props
  const {
    disabled,
    error,
    id,
    label,
    name,
    onChange,
    options,
    readOnly,
    value,
  } = props;

  // get field info
  const { errorMessage } = fieldInformation(name || id);

  return (
    <FormControl fullWidth sx={{ my: 1 }}>
      <InputLabel id={`${id}-label`} error={!!error}>
        {label}
      </InputLabel>

      <Select
        labelId={`${id}-label`}
        id={id}
        name={name || id}
        label={label}
        value={value}
        onChange={(event) => onChange(event, 'unchanged', options)}
        readOnly={!!readOnly}
        disabled={!!disabled}
      >
        {/* Check options exists and has at least one entry */}
        {options && options.length > 0 ? (
          options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>None Available</MenuItem>
        )}
      </Select>

      {!!error && <FormHelperText error>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default InputSelect;
