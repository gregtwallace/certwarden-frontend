import { type FC, type MouseEvent } from 'react';
import { type inputHandlerFunc } from '../../../helpers/input-handler';

import fieldInformation from './fields-info';

import {
  Box,
  FormControl,
  FormHelperText,
  Toolbar,
  Typography,
} from '@mui/material';
import Button from '../Button/Button';
import InputTextField from './InputTextField';

// doesnt currently support numbers or other input types that need
// manipulation of the target.value (e.g. ParseInt) !

type propTypes<valueObject extends object> = {
  id: string;
  name?: string;
  label: string;
  subLabel: string;
  minElements?: number;
  newObject: valueObject;
  value: valueObject[];
  onChange: inputHandlerFunc;
  error: number[];
};

const InputArrayObjectsOfText = <valueObject extends object>(
  props: propTypes<valueObject>
): FC => {
  // destructure props
  const {
    error,
    id,
    label,
    minElements,
    name,
    newObject,
    onChange,
    subLabel,
    value,
  } = props;

  // get field info
  const { errorMessage } = fieldInformation(name || id);

  // add an additional field to the array
  const addElementHandler = (
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();

    const newArray = [...value];
    newArray.push(newObject);

    const syntheticEvent = {
      target: {
        name: name || id,
        value: newArray,
      },
    };

    onChange(syntheticEvent);
  };

  // remove the field with specified index from the array
  const removeElementHandler = (event: MouseEvent, index: number): void => {
    event.preventDefault();

    const newArray = [...value];
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
  const fieldChangeHandler = (event): void => {
    const newArray = [...value];

    // get element index (id is in format ID-Index-MemberField)
    const splitTargetId = event.target.id.split('-');
    const elementIndex = splitTargetId[1];
    const elementKeyName = splitTargetId[2];

    // update element's key
    newArray[elementIndex] = {
      ...value[elementIndex],
      [elementKeyName]: event.target.value,
    };

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
      <Typography id={`${id}-label`} component='label' sx={{ mx: 1, mt: 1 }}>
        {label}
      </Typography>

      {value.length <= 0 ? (
        <Typography sx={{ m: 1 }}>None</Typography>
      ) : (
        value.map((subValue, i) => (
          <Box
            key={`${id}.${i}`}
            sx={{
              mt: 1,
              p: 1,
              border: 1,
              borderRadius: '4px',
              /* Note: action.disabled isn't the exact default field border color, but it is close */
              borderColor: error?.includes(i)
                ? 'error.main'
                : 'action.disabled',
            }}
          >
            <Toolbar
              variant='dense'
              disableGutters
              sx={{
                mb: 1,
                color: error?.includes(i) ? 'error.main' : undefined,
              }}
            >
              <Typography id={id + '-' + i} sx={{ mb: 1 }}>
                {subLabel + ' ' + (i + 1).toString()}
              </Typography>

              <Box sx={{ flexGrow: 1 }}></Box>

              {value.length > (minElements || 0) && (
                <Button
                  color='error'
                  size='small'
                  onClick={(event) => removeElementHandler(event, i)}
                >
                  Remove
                </Button>
              )}
            </Toolbar>

            <Box>
              {/* Output a field for each member of object */}
              {Object.entries(subValue).map((member) => {
                const [key, value] = member;

                // make key pretty
                const keyPretty = key
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                return (
                  <InputTextField
                    key={`${id}.${i}.${key}`}
                    id={id + '-' + i + '-' + key}
                    label={keyPretty}
                    value={value}
                    onChange={fieldChangeHandler}
                  />
                );
              })}
            </Box>

            {!!error?.includes(i) && (
              <FormHelperText error>{errorMessage}</FormHelperText>
            )}
          </Box>
        ))
      )}

      <Toolbar variant='dense' disableGutters sx={{ m: 0, p: 0 }}>
        <Button color='success' size='small' onClick={addElementHandler}>
          Add
        </Button>
      </Toolbar>
    </FormControl>
  );
};

export default InputArrayObjectsOfText;
