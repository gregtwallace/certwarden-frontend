import { Checkbox, FormControlLabel } from '@mui/material';

const InputCheckbox = (props) => {
  // needed to avoid error about uncontrolled becoming controlled
  const checked = props.checked ? true : false;

  return (
    <FormControlLabel
      sx={{ my: 1 }}
      control={
        <Checkbox
          id={props.id}
          onChange={props.onChange}
          checked={checked}
          disabled={props.disabled}
        />
      }
      label={props.children}
    />
  );
};

export default InputCheckbox;
