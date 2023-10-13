import PropTypes from 'prop-types';

import { FormControl, Toolbar, Typography } from '@mui/material';
import Button from '../Button/Button';
import FormRowRight from './FormRowRight';
import InputTextField from './InputTextField';

// doesnt currently support numbers or other input types that need
// manipulation of the target.value (e.g. ParseInt) !

const InputArrayText = (props) => {
  // destructure props
  const { error, id, label, minElements, name, onChange, subLabel, value } =
    props;

  // add an additional field to the array
  const addElementHandler = (event) => {
    event.preventDefault();

    let newArray = [...value];
    newArray.push('');

    const syntheticEvent = {
      target: {
        name: name || id,
        value: newArray,
      },
    };

    onChange(syntheticEvent);
  };

  // remove the field with specified index from the array
  const removeElementHandler = (event, index) => {
    event.preventDefault();

    let newArray = [...value];
    newArray.splice(index, 1);

    const syntheticEvent = {
      target: {
        name: name || id,
        value: newArray,
      },
    };

    onChange(syntheticEvent);
  };

  // handle field value updates
  const fieldChangeHandler = (event) => {
    let newArray = [...value];

    // get element index (id is in format ID-Index)
    const elementIndex = event.target.id.split('-')[1];

    // update element
    newArray[elementIndex] = event.target.value;

    const syntheticEvent = {
      target: {
        name: name || id,
        value: newArray,
      },
    };

    onChange(syntheticEvent);
  };

  return (
    <FormControl id={id} fullWidth sx={{ my: 1 }}>
      <Typography id={`${id}-label`} component='label' sx={{ m: 1 }}>
        {label}
      </Typography>

      {value.length <= 0 ? (
        <Typography sx={{ m: 1 }}>None</Typography>
      ) : (
        value.map((subValue, i) => (
          <FormRowRight key={`${id}.${i}`}>
            <InputTextField
              id={id + '-' + i}
              name={name ? name + '-' + i : undefined}
              label={subLabel + ' ' + parseInt(i + 1)}
              value={subValue}
              onChange={fieldChangeHandler}
              error={!!error?.includes(i)}
            />

            {value.length > (minElements || 0) && (
              <Button
                type='delete'
                size='small'
                onClick={(event) => removeElementHandler(event, i)}
              >
                Remove
              </Button>
            )}
          </FormRowRight>
        ))
      )}

      <Toolbar variant='dense' disableGutters sx={{ m: 0, p: 0 }}>
        <Button type='add' size='small' onClick={addElementHandler}>
          Add
        </Button>
      </Toolbar>
    </FormControl>
  );
};

InputArrayText.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  subLabel: PropTypes.string.isRequired,
  minElements: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.PropTypes.string).isRequired,
  onChange: PropTypes.func,
  error: PropTypes.arrayOf(PropTypes.number),
};

export default InputArrayText;
