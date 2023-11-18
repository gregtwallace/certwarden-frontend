import { type ReactElement } from 'react';
import {
  type inputHandlerFuncType,
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

type propTypes<ValType extends selectInputOptionValuesType> = {
  id: string;
  name?: string;
  label: string;
  value: ValType;
  onChange: inputHandlerFuncType;
  options: selectInputOption<ValType>[];
  error?: boolean | undefined;
  readOnly?: boolean;
  disabled?: boolean;
};

const InputSelect = <ValType extends selectInputOptionValuesType>(
  props: propTypes<ValType>
): ReactElement<propTypes<ValType>> => {
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
  const { errorMessage, htmlType } = fieldInformation(name || id);

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
        onChange={
          onChange
            ? (event) =>
                onChange(
                  event,
                  htmlType === 'number' ? 'number' : 'unchanged',
                  options
                )
            : undefined
        }
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
