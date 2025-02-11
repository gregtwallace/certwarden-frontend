import { type ReactNode } from 'react';
import { type inputHandlerFuncType } from '../../../../../helpers/input-handler';
import { type validationErrorsType } from '../../../../../types/frontend';
import { escapeStringForRegExp } from '../../../../../helpers/regex';

import { Box, FormControl, Toolbar } from '@mui/material';

import Button from '../../../../UI/Button/Button';
import FormInfo from '../../../../UI/FormMui/FormInfo';
import FormLabel from '../../../../UI/FormMui/FormLabel';
import InputCheckbox from '../../../../UI/FormMui/InputCheckbox';
import InputTextField from '../../../../UI/FormMui/InputTextField';

export type certExtension = {
  description: string;
  oid: string;
  critical: boolean;
  value_hex: string;
};

type propTypes = {
  id: string;
  value: certExtension[];
  onChange: inputHandlerFuncType;
  validationErrors: validationErrorsType;
};

// input type for the custom extension object array
const InputExtraExtensions = (props: propTypes): ReactNode => {
  // destructure props
  const { id, value, onChange, validationErrors } = props;

  // consts
  const name = id;
  const label = 'Extra Extensions';
  const subLabel = 'Extension';
  const minElements = 0;

  // add an additional extension to the array
  const addElementHandler = (newExt?: certExtension): void => {
    const newArrayVal = [...value];
    newArrayVal.push(
      newExt || {
        description: '',
        oid: '',
        critical: false,
        value_hex: '',
      }
    );

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
              currentValidationErrors[fieldName] || false;
          }

          // if errIndex is greater than delete index, shift error -1
          if (errIndex > index) {
            newValidationErrors[`${id}.${(errIndex - 1).toString()}`] =
              currentValidationErrors[fieldName] || false;
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
              currentValidationErrors[fieldName] || false;
          }

          // if errIndex is greater than delete index, shift error -1
          if (errIndex > index) {
            newValidationErrors[
              `${id}.${(errIndex - 1).toString()}.${subFieldName}`
            ] = currentValidationErrors[fieldName] || false;
          }

          // if errIndex is delete index, discard error
          // no-op
        } else {
          // if not related to this input, just copy
          newValidationErrors[fieldName] =
            currentValidationErrors[fieldName] || false;
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
        value.map((oneExt, objIndex) => (
          <Box
            key={`${id}.${objIndex.toString()}`}
            sx={{
              mt: 1,
              p: 1,
              border: 1,
              borderRadius: '4px',
              /* Note: action.disabled isn't the exact default field border color, but it is close */
              borderColor:
                `${id}.${objIndex.toString()}` in validationErrors
                  ? 'error.main'
                  : 'action.disabled',
            }}
          >
            <Toolbar variant='dense' disableGutters sx={{ mb: 1 }}>
              <FormInfo
                color={
                  `${id}.${objIndex.toString()}` in validationErrors
                    ? 'error.main'
                    : undefined
                }
                sx={{ m: 1 }}
              >
                {subLabel + ' ' + (objIndex + 1).toString()}
              </FormInfo>

              <Box sx={{ flexGrow: 1 }} />

              {value.length > minElements && (
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
              {/* Output each cert extension field */}
              <InputTextField
                id={id + '.' + objIndex.toString() + '.description'}
                name={
                  name
                    ? name + '.' + objIndex.toString() + '.description'
                    : id + '.' + objIndex.toString() + '.description'
                }
                label='Description'
                value={oneExt.description}
                onChange={onChange}
                error={
                  validationErrors[
                    id + '.' + objIndex.toString() + '.description'
                  ]
                }
              />

              <InputTextField
                id={id + '.' + objIndex.toString() + '.oid'}
                name={
                  name
                    ? name + '.' + objIndex.toString() + '.oid'
                    : id + '.' + objIndex.toString() + '.oid'
                }
                label='OID'
                value={oneExt.oid}
                onChange={onChange}
                error={
                  validationErrors[id + '.' + objIndex.toString() + '.oid']
                }
              />

              <InputTextField
                id={id + '.' + objIndex.toString() + '.value_hex'}
                name={
                  name
                    ? name + '.' + objIndex.toString() + '.value_hex'
                    : id + '.' + objIndex.toString() + '.value_hex'
                }
                label='Hex Bytes Value'
                value={oneExt.value_hex}
                onChange={onChange}
                error={
                  validationErrors[
                    id + '.' + objIndex.toString() + '.value_hex'
                  ]
                }
              />

              <InputCheckbox
                id={id + '.' + objIndex.toString() + '.critical'}
                checked={oneExt.critical}
                onChange={onChange}
              >
                Critical
              </InputCheckbox>
            </Box>
          </Box>
        ))
      )}

      <Toolbar variant='dense' disableGutters sx={{ m: 0, p: 0 }}>
        <Button
          color='success'
          size='small'
          onClick={(_event) => {
            addElementHandler(undefined);
          }}
        >
          Add
        </Button>

        <Button
          color='success'
          size='small'
          onClick={(_event) => {
            addElementHandler({
              description: 'OCSP Must Staple',
              oid: '1.3.6.1.5.5.7.1.24',
              critical: false,
              value_hex: '3003020105',
            });
          }}
        >
          Add Must Staple
        </Button>
      </Toolbar>
    </FormControl>
  );
};

export default InputExtraExtensions;
