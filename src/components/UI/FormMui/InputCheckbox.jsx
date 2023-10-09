import PropTypes from 'prop-types';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import fieldInformation from './fields-info';

const InputCheckbox = (props) => {
  // destructure props
  const { checked, children, disabled, error, id, name, onChange } = props;

  // get error message
  const { errorMessage } = fieldInformation(name || id);

  return (
    <FormControl fullWidth sx={{ my: 1 }}>
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            name={name || id}
            onChange={(event) => onChange(event, 'checkbox')}
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

InputCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default InputCheckbox;
