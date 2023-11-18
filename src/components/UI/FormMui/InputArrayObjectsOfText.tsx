import { type ReactNode } from 'react';
import { type inputHandlerFuncType } from '../../../helpers/input-handler';
import { type validationErrorsType } from '../../../types/frontend';

import { Box, FormControl, Toolbar } from '@mui/material';

import Button from '../Button/Button';
import FormInfo from './FormInfo';
import FormLabel from './FormLabel';
import InputTextField from './InputTextField';

// doesnt currently support numbers or other input types that need
// manipulation of the target.value (e.g. ParseInt) !

type propTypes<valueObject extends Record<string, string>> = {
  id: string;
  name?: string;
  label: string;
  subLabel: string;
  newObject: valueObject;
  value: valueObject[];
  onChange: inputHandlerFuncType;

  minElements?: number;
  validationErrors?: validationErrorsType;
};

const InputArrayObjectsOfText = <valueObject extends Record<string, string>>(
  props: propTypes<valueObject>
): ReactNode => {
  // destructure props
  const {
    id,
    label,
    minElements,
    name,
    newObject,
    onChange,
    subLabel,
    validationErrors,
    value,
  } = props;

  // add an additional field to the array
  const addElementHandler = (): void => {
    const newArrayVal = [...value];
    newArrayVal.push(newObject);

    const syntheticEvent = {
      target: {
        name: name || id,
        value: newArrayVal,
      },
    };

    onChange(syntheticEvent, 'unchanged');
  };

  // remove the field with specified index from the array
  const removeElementHandler = (index: number): void => {
    const newArrayVal = [...value];
    newArrayVal.splice(index, 1);

    const syntheticEvent = {
      target: {
        name: name || id,
        value: newArrayVal,
      },
    };

    onChange(syntheticEvent, 'unchanged');
  };

  return (
    <FormControl id={id} fullWidth sx={{ my: 1 }}>
      <FormLabel id={`${id}-label`}>{label}</FormLabel>

      {value.length <= 0 ? (
        <FormInfo sx={{ m: 1 }}>None</FormInfo>
      ) : (
        /* Output each member of the object array */
        value.map((subValue, objIndex) => (
          <Box
            key={`${id}.${objIndex}`}
            sx={{
              mt: 1,
              p: 1,
              border: 1,
              borderRadius: '4px',
              /* Note: action.disabled isn't the exact default field border color, but it is close */
              borderColor:
                validationErrors && `${id}.${objIndex}` in validationErrors
                  ? 'error.main'
                  : 'action.disabled',
            }}
          >
            <Toolbar variant='dense' disableGutters sx={{ mb: 1 }}>
              <FormInfo
                color={
                  validationErrors && `${id}.${objIndex}` in validationErrors
                    ? 'error.main'
                    : undefined
                }
                sx={{ m: 1 }}
              >
                {subLabel + ' ' + (objIndex + 1)}
              </FormInfo>

              <Box sx={{ flexGrow: 1 }} />

              {value.length > (minElements || 0) && (
                <Button
                  size='small'
                  color='error'
                  onClick={(_event) => removeElementHandler(objIndex)}
                >
                  Remove
                </Button>
              )}
            </Toolbar>

            <Box>
              {/* Output a field for each member of object */}
              {Object.entries(subValue).map((member) => {
                const [fieldKey, fieldValue] = member;

                // make key pretty
                const keyPretty = fieldKey
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                return (
                  <InputTextField
                    key={`${id}.${objIndex}.${fieldKey}`}
                    id={id + '.' + objIndex + '.' + fieldKey}
                    name={
                      name
                        ? name + '.' + objIndex + '.' + fieldKey
                        : id + '.' + objIndex + '.' + fieldKey
                    }
                    label={keyPretty}
                    value={fieldValue}
                    onChange={onChange}
                    error={
                      !!validationErrors &&
                      validationErrors[id + '.' + objIndex + '.' + fieldKey]
                    }
                  />
                );
              })}
            </Box>
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
