import PropTypes from 'prop-types';
import fieldInformation from './fields-info';

import { TextField } from '@mui/material';

const InputTextField = (props) => {
  // destructure props
  const {
    disabled,
    error,
    id,
    label,
    multiline,
    name,
    onChange,
    readOnly,
    value,
  } = props;

  // get field info
  const { errorMessage, type } = fieldInformation(name || id);

  return (
    <TextField
      id={id}
      name={name || id}
      type={type || 'text'}
      label={label}
      value={value}
      onChange={(event) => onChange(event, type || 'text')}
      readOnly={!!readOnly}
      disabled={!!disabled}
      error={!!error}
      helperText={!!error && errorMessage}
      fullWidth
      variant='outlined'
      sx={{ my: 1 }}
      // multiline / text area
      multiline={!!multiline}
      minRows={multiline ? 5 : undefined}
      maxRows={multiline ? 10 : undefined}
      InputProps={
        multiline
          ? {
              style: {
                fontFamily: 'Monospace',
                fontSize: 14,
              },
            }
          : undefined
      }
      // multiline / text area -- end
    />
  );
};

InputTextField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func,
  multiline: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
};

export default InputTextField;
