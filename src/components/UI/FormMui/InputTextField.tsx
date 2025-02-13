import { type FC } from 'react';
import { type inputHandlerFuncType } from '../../../helpers/input-handler';

import fieldInformation from './fields-info';

import { TextField as MuiTextField } from '@mui/material';

// prop types
type propTypes = {
  id: string;
  name?: string;
  label: string;
  value: string | number;
  onChange?: inputHandlerFuncType;
  multiline?: boolean | undefined;
  disabled?: boolean | undefined;
  error?: boolean | undefined;
};

// component
const InputTextField: FC<propTypes> = (props) => {
  const { disabled, error, id, label, multiline, name, onChange, value } =
    props;

  // get field info
  const { errorMessage, htmlType } = fieldInformation(name ?? id);

  return (
    <MuiTextField
      id={id}
      name={name ?? id}
      type={htmlType}
      label={label}
      value={value}
      onChange={
        onChange
          ? (event) => {
              onChange(event, htmlType === 'number' ? 'number' : 'unchanged');
            }
          : undefined
      }
      disabled={!!disabled}
      error={!!error}
      helperText={!!error && errorMessage}
      fullWidth
      variant='outlined'
      sx={{ my: 1 }}
      // multiline / text area
      multiline={!!multiline}
      minRows={5}
      maxRows={10}
      slotProps={{
        input: multiline
          ? {
              style: {
                fontFamily: 'Monospace',
                fontSize: 14,
              },
            }
          : {},
      }}
      // multiline / text area -- end
    />
  );
};

export default InputTextField;
