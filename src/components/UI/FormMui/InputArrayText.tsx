import { type FC } from 'react';
import { type inputHandlerFuncType } from '../../../helpers/input-handler';
import { type validationErrorsType } from '../../../types/frontend';

import { FormControl, Toolbar } from '@mui/material';
import Button from '../Button/Button';
import FormInfo from './FormInfo';
import FormLabel from './FormLabel';
import FormRowRight from './FormRowRight';
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
  validationErrors?: validationErrorsType;
};

const InputArrayText: FC<propsType> = (props) => {
  // destructure props
  const {
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
        value.map((subValue, index) => (
          <FormRowRight key={`${id}.${index}`}>
            <InputTextField
              id={id + '.' + index}
              name={name ? name + '.' + index : id + '.' + index}
              label={subLabel + ' ' + (index + 1)}
              value={subValue}
              onChange={onChange}
              error={!!validationErrors && validationErrors[id + '.' + index]}
            />

            {value.length > (minElements || 0) && (
              <Button
                size='small'
                color='error'
                onClick={(_event) => removeElementHandler(index)}
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
