import { type ReactNode } from 'react';
import { type inputHandlerFuncType } from '../../../helpers/input-handler';
import { type validationErrorsType } from '../../../types/frontend';
import { escapeStringForRegExp } from '../../../helpers/regex';

import { Box, FormControl, Toolbar } from '@mui/material';

import { objectHasKeyStartingWith } from '../../../helpers/form-validation';

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
  validationErrors: validationErrorsType;
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
        name: name ?? id,
        value: newArrayVal,
      },
    };

    onChange(syntheticEvent, 'unchanged');
  };

  // remove the field with specified index from the array
  const removeElementHandler = (
    index: number,
    currentValidationErrors: validationErrorsType | undefined
  ): void => {
    // update validation object if defined
    if (currentValidationErrors !== undefined) {
      const regexString = `^${escapeStringForRegExp(id)}.[0-9]+$`;
      const regex = new RegExp(regexString);

      const regexSubfieldString = `^${escapeStringForRegExp(
        id
      )}.[0-9]+.[A-Za-z_-]+$`;
      const regexSubfield = new RegExp(regexSubfieldString);

      const newValidationErrors: validationErrorsType = {};

      for (const fieldName of Object.keys(currentValidationErrors)) {
        // modify main field
        if (fieldName.match(regex)) {
          const lastPeriodIndex = fieldName.lastIndexOf('.');
          const errIndexStr = fieldName.substring(lastPeriodIndex + 1);
          const errIndex = Number(errIndexStr);

          // if errIndex < delete index, just copy
          if (errIndex < index) {
            newValidationErrors[fieldName] =
              currentValidationErrors[fieldName] ?? false;
          }

          // if errIndex is greater than delete index, shift error -1
          if (errIndex > index) {
            newValidationErrors[`${id}.${(errIndex - 1).toString()}`] =
              currentValidationErrors[fieldName] ?? false;
          }

          // if errIndex is delete index, discard error
          // no-op
        } else if (fieldName.match(regexSubfield)) {
          // modify subfields
          const fieldPath = fieldName.split('.');
          const subFieldName = fieldPath[fieldPath.length - 1];
          if (!subFieldName) {
            throw new Error('invalid subFieldName');
          }

          const errIndexStr = fieldPath[fieldPath.length - 2];
          const errIndex = Number(errIndexStr);

          // if errIndex < delete index, just copy
          if (errIndex < index) {
            newValidationErrors[fieldName] =
              currentValidationErrors[fieldName] ?? false;
          }

          // if errIndex is greater than delete index, shift error -1
          if (errIndex > index) {
            newValidationErrors[
              `${id}.${(errIndex - 1).toString()}.${subFieldName}`
            ] = currentValidationErrors[fieldName] ?? false;
          }

          // if errIndex is delete index, discard error
          // no-op
        } else {
          // if not related to this input, just copy
          newValidationErrors[fieldName] =
            currentValidationErrors[fieldName] ?? false;
        }
      }

      const syntheticEvent1 = {
        target: {
          name: 'validationErrors',
          value: newValidationErrors,
        },
      };

      onChange(syntheticEvent1, 'unchanged');
    }

    // remove data array member
    const newArrayVal = [...value];
    newArrayVal.splice(index, 1);

    const syntheticEvent = {
      target: {
        name: name ?? id,
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
            key={`${id}.${objIndex.toString()}`}
            sx={{
              mt: 1,
              p: 1,
              border: 1,
              borderRadius: '4px',
              /* Note: action.disabled isn't the exact default field border color, but it is close */
              borderColor: objectHasKeyStartingWith(
                validationErrors,
                `${id}.${objIndex.toString()}`
              )
                ? 'error.main'
                : 'action.disabled',
            }}
          >
            <Toolbar variant='dense' disableGutters sx={{ mb: 1 }}>
              <FormInfo
                sx={{
                  m: 1,
                  color: objectHasKeyStartingWith(
                    validationErrors,
                    `${id}.${objIndex.toString()}`
                  )
                    ? 'error.main'
                    : undefined,
                }}
              >
                {subLabel + ' ' + (objIndex + 1).toString()}
              </FormInfo>

              <Box sx={{ flexGrow: 1 }} />

              {value.length > (minElements ?? 0) && (
                <Button
                  size='small'
                  color='error'
                  onClick={(_event) => {
                    removeElementHandler(objIndex, validationErrors);
                  }}
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
                    key={`${id}.${objIndex.toString()}.${fieldKey}`}
                    id={id + '.' + objIndex.toString() + '.' + fieldKey}
                    name={
                      name
                        ? name + '.' + objIndex.toString() + '.' + fieldKey
                        : id + '.' + objIndex.toString() + '.' + fieldKey
                    }
                    label={keyPretty}
                    value={fieldValue}
                    onChange={onChange}
                    error={
                      validationErrors[
                        id + '.' + objIndex.toString() + '.' + fieldKey
                      ]
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
