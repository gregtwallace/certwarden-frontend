import { type FC } from 'react';
import { type inputHandlerFuncType } from '../../../helpers/input-handler';
import { type validationErrorsType } from '../../../types/frontend';
import { escapeStringForRegExp } from '../../../helpers/regex';

import { FormControl, Toolbar } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import Button from '../Button/Button';
import FormInfo from './FormInfo';
import FormLabel from './FormLabel';
import FormRowRight from './FormRowRight';
import IconButtonAsLink from '../../UI/Button/IconButtonAsLink';
import InputTextField from './InputTextField';

// doesnt currently support numbers or other input types that need
// manipulation of the target.value (e.g. ParseInt) !

type propsType = {
  id: string;
  name?: string;
  label: string;
  subLabel: string;
  value: string[];
  onChange: inputHandlerFuncType;

  minElements?: number;
  validationErrors: validationErrorsType;

  helpURL?: string;
};

const InputArrayText: FC<propsType> = (props) => {
  // destructure props
  const {
    helpURL,
    id,
    label,
    minElements,
    name,
    onChange,
    subLabel,
    validationErrors,
    value,
  } = props;

  // add an additional field to the array
  const addElementHandler = (): void => {
    const newArrayVal = [...value];
    newArrayVal.push('');

    const syntheticEvent = {
      target: {
        name: name || id,
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

      const newValidationErrors: validationErrorsType = {};

      for (const fieldName of Object.keys(currentValidationErrors)) {
        // only modify errors related to this input
        if (fieldName.match(regex)) {
          const lastPeriodIndex = fieldName.lastIndexOf('.');
          const errIndexStr = fieldName.substring(lastPeriodIndex + 1);
          const errIndex = Number(errIndexStr);

          // if errIndex < delete index, just copy
          if (errIndex < index) {
            newValidationErrors[fieldName] =
              currentValidationErrors[fieldName] || false;
          }

          // if errIndex is greater than delete index, shift error -1
          if (errIndex > index) {
            newValidationErrors[`${id}.${(errIndex - 1).toString()}`] =
              currentValidationErrors[fieldName] || false;
          }

          // if errIndex is delete index, discard error
          // no-op
        } else {
          // if not related to this input, just copy
          newValidationErrors[fieldName] =
            currentValidationErrors[fieldName] || false;
        }
      }

      console.log(newValidationErrors);
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

    const syntheticEvent2 = {
      target: {
        name: name || id,
        value: newArrayVal,
      },
    };

    onChange(syntheticEvent2, 'unchanged');
  };

  return (
    <FormControl id={id} fullWidth sx={{ my: 1 }}>
      <FormLabel id={`${id}-label`}>
        {label}

        {helpURL != undefined && (
          <IconButtonAsLink tooltip='Help' to={helpURL} target='_blank'>
            <HelpIcon style={{ fontSize: '17px' }} />
          </IconButtonAsLink>
        )}
      </FormLabel>

      {value.length <= 0 ? (
        <FormInfo sx={{ m: 1 }}>None</FormInfo>
      ) : (
        value.map((subValue, index) => (
          <FormRowRight key={`${id}.${index.toString()}`}>
            <InputTextField
              id={id + '.' + index.toString()}
              name={
                name
                  ? name + '.' + index.toString()
                  : id + '.' + index.toString()
              }
              label={subLabel + ' ' + (index + 1).toString()}
              value={subValue}
              onChange={onChange}
              error={validationErrors[id + '.' + index.toString()]}
            />

            {value.length > (minElements || 0) && (
              <Button
                size='small'
                color='error'
                onClick={(_event) => {
                  removeElementHandler(index, validationErrors);
                }}
              >
                Remove
              </Button>
            )}
          </FormRowRight>
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

export default InputArrayText;
