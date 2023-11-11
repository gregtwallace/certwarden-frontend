import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { type SelectChangeEvent } from '@mui/material';

// import { redactJSONObject } from "./logging";

type stateValueTypes =
  | string
  | number
  | Record<string, unknown>
  | boolean
  | undefined;
type stateObject = Record<string, unknown>;
type valueConversionTypes = 'unchanged' | 'number' | false | true;

// modifyValueInObject takes the object and modifies the property with name
// and sets it to value
const modifyValueInObject = <objType extends stateObject>(
  obj: objType,
  dottedPropertyName: string,
  newValue: stateValueTypes
): objType => {
  // return (previousState[dottedPropertyName] = newValue);

  const path = dottedPropertyName.split('.');
  let newObject = newValue;

  // deeper layers not supported, return unmodified
  if (path.length >= 5) {
    return obj;
  }

  // 3rd nested layer
  if (path.length >= 4) {
    newObject = {
      ...obj[path[0]][path[1]][path[2]],
      [path[3]]: newObject,
    };
  }

  // 2nd nested layer
  if (path.length >= 3) {
    newObject = {
      ...obj[path[0]][path[1]],
      [path[2]]: newObject,
    };
  }

  // 1st nested layer
  if (path.length >= 2) {
    newObject = {
      ...obj[path[0]],
      [path[1]]: newObject,
    };
  }

  // top level
  newObject = {
    ...obj,
    [path[0]]: newObject,
  };

  // if undefined value, delete the property
  if (newValue == undefined) {
    switch (path.length) {
      case 4:
        delete newObject[path[0]][path[1]][path[2]][path[3]];
        break;
      case 3:
        delete newObject[path[0]][path[1]][path[2]];
        break;
      case 2:
        delete newObject[path[0]][path[1]];
        break;
      case 1:
        delete newObject[path[0]];
        break;
    }
  }

  return newObject;
};

// object for other values to set
export type inputOption = {
  value: string;
  name: string;
  alsoSet?: {
    name: string;
    value: stateValueTypes;
  }[];
};

// type for custom inputHandlerFunc
export type inputHandlerFunc = (
  // event is the standard input change event
  event:
    | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | SelectChangeEvent<inputOption>,
  // convertValueTo is the value type that the event.target.value should be
  // forced to when saved in state
  convertValueTo: valueConversionTypes,
  // inputOptions is used for select input elements to enable changing of
  // multiple other values on select change. For instance, to add or remove
  // fields that are only relevant to a particular item in the Select element.
  inputOptions?: inputOption[]
) => void;

// formChangeHandlerFunc returns the input change handler specific
// to the setFormState func that is passed in
export const inputHandlerFuncMaker = <StateObject extends stateObject>(
  setFormState: Dispatch<SetStateAction<StateObject>>
): inputHandlerFunc => {
  return (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<inputOption>,
    convertValueTo: valueConversionTypes,
    inputOptions?: inputOption[]
  ) => {
    // set newVal to the real value to store in state
    const inputValue = event.target.value;
    let value: stateValueTypes = inputValue;

    // attempt to convert value if needed
    if (convertValueTo === 'number') {
      value = Number(inputValue);
    } else if (convertValueTo === true || convertValueTo === false) {
      value = convertValueTo;
    }

    setFormState((prevState) => {
      // initial newState modifying just the main field and its value
      let newState = modifyValueInObject(prevState, event.target.name, value);

      // further modification if there are alsoSet values on inputOptions
      if (inputOptions) {
        const alsoSet = inputOptions?.find((o) => o.value === value)?.alsoSet;
        if (alsoSet != undefined) {
          newState = alsoSet.reduce(
            (accumulator, field) =>
              modifyValueInObject(accumulator, field.name, field.value),
            newState
          );
        }
      }

      // console.log(redactJSONObject(newState))

      return newState;
    });
  };
};
