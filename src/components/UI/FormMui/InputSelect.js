import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

const InputSelect = (props) => {
  let errorMessage = '';
  switch (props.id) {
    case 'algorithm_value':
      errorMessage = 'Algorithm must be selected to generate a key.';
      break;
    case 'key_source':
      errorMessage = 'Key source must be selected.';
      break;

    default:
      errorMessage = 'This field has an error.';
      break;
  }

  return (
    <FormControl fullWidth sx={{ my: 1 }}>
      <InputLabel id={`${props.id}-label`} error={props.error}>
        {props.label}
      </InputLabel>
      <Select
        labelId={`${props.id}-label`}
        id={props.id}
        name={props.name ? props.name : props.id}
        label={props.label}
        value={props.value}
        onChange={props.onChange}
        readOnly={props.readOnly}
        disabled={props.disabled}
      >
        {props?.options &&
          props.options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.name}
            </MenuItem>
          ))}
      </Select>
      {props.error && <FormHelperText error>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default InputSelect;
