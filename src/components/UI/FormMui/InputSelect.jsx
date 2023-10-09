import PropTypes from 'prop-types';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import fieldInformation from './fields-info';

const InputSelect = (props) => {
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
  const { errorMessage, type } = fieldInformation(name || id);

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
        onChange={(event) => onChange(event, type || 'text')}
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

InputSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    })
  ),
  error: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default InputSelect;
