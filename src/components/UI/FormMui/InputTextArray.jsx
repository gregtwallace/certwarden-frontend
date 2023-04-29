import PropTypes from 'prop-types';
import { FormControl, Toolbar, Typography } from '@mui/material';

import Button from '../Button/Button';
import InputTextField from './InputTextField';

const InputTextArray = (props) => {
  // send the array value as an event
  // state will be managed by the parent
  const onChange = (newArray) => {
    const event = {};
    event.target = {};

    event.target.id = props.id;
    event.target.name = props.name ? props.name : props.id;
    event.target.value = newArray;

    props.onChange(event);
  };

  // handle changing of the content of any string
  const stringChangeHandler = (event) => {
    var newArray = [...props.value];

    // get element index based on id
    let idPrefix = props.id + '_';
    let i = event.target.id.slice(idPrefix.length);

    // update element
    newArray[i] = event.target.value;

    onChange(newArray);
  };

  // add an additional field to the array
  const addElementHandler = (event) => {
    event.preventDefault();

    var newArray = [...props.value];
    newArray.push('');

    onChange(newArray);
  };

  // remove the last field of the array
  const removeElementHandler = (event) => {
    event.preventDefault();

    var newArray = [...props.value];
    newArray.pop();

    onChange(newArray);
  };

  return (
    <FormControl id={props.id} fullWidth sx={{ my: 1 }}>
      <Typography component='label' sx={{ mx: 1 }}>
        {props.label}
      </Typography>

      {props.value.length === 0 ? (
        <Typography sx={{ mx: 1, mt: 1 }}>None</Typography>
      ) : (
        props.value.map((element, i) => (
          <InputTextField
            id={props.id + '_' + i}
            name={props.name ? props.name + '_' + i : props.id + '_' + i}
            key={i}
            value={element}
            onChange={stringChangeHandler}
            error={props?.error?.includes(i) && true}
          />
        ))
      )}
      <Toolbar variant='dense' disableGutters sx={{ m: 0, p: 0 }}>
        <Button type='add' size='small' onClick={addElementHandler}>
          Add
        </Button>
        {props.value.length > 0 && (
          <Button type='delete' size='small' onClick={removeElementHandler}>
            Remove
          </Button>
        )}
      </Toolbar>
    </FormControl>
  );
};

InputTextArray.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  onChange: PropTypes.func,
  error: PropTypes.arrayOf(PropTypes.number),
};

export default InputTextArray;
