import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

// import { redactJSONObject } from "./logging";

// modifyValueObject takes the original object and modifies the
// property with name and sets it to value
const modifyValueObject = <T extends object>(
  originalObject: T,
  dottedPropertyName: string,
  newValue: string | number | boolean | object
): T => {
  const path = dottedPropertyName.split('.');
  let newObject = newValue;

  // deeper layers not supported, return original
  if (path.length >= 5) {
    return originalObject;
  }

  // 3rd nested layer
  if (path.length >= 4) {
    newObject = {
      ...originalObject[path[0]][path[1]][path[2]],
      [path[3]]: newObject,
    };
  }

  // 2nd nested layer
  if (path.length >= 3) {
    newObject = {
      ...originalObject[path[0]][path[1]],
      [path[2]]: newObject,
    };
  }

  // 1st nested layer
  if (path.length >= 2) {
    newObject = {
      ...originalObject[path[0]],
      [path[1]]: newObject,
    };
  }

  // top level
  newObject = {
    ...originalObject,
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
type inputOption = {
  value: number | string;
  name: string;
  alsoSet?: {
    name: string;
    value: number | string | object;
  }[];
};

// type for custom inputHandlerFunc
export type inputHandlerFunc = (
  event: ChangeEvent<HTMLInputElement>,
  type: string,
  inputOptions?: inputOption[]
) => void;

// formChangeHandlerFunc returns the input change handler specific
// to the setFormState func that is passed in
export const inputHandlerFuncMaker = <T extends object>(
  setFormState: Dispatch<SetStateAction<T>>
): inputHandlerFunc => {
  // event is the standard event object
  // type allows specifying how to parse the new target value
  // options is used by InputSelect to potentially set additional field values
  //   if changing the select alters other parts of the form
  return (
    event: ChangeEvent<HTMLInputElement>,
    type: string,
    inputOptions?: inputOption[]
  ) => {
    // new val based on the input type, default is to just
    // use event.target.value as-is
    let eventVal: string | number | boolean = event.target.value;
    if (type === 'number') {
      eventVal = parseInt(eventVal);
    } else if (type === 'checkbox') {
      eventVal = event.target.checked;
    }

    // parse options to check for alsoSet values
    const alsoSet = inputOptions?.find((o) => o.value === eventVal)?.alsoSet;

    setFormState((prevState) => {
      // initial newState modifying just the main field and its value
      let newState = modifyValueObject(prevState, event.target.name, eventVal);

      // further modification if there are alsoSet values
      if (alsoSet != undefined) {
        newState = alsoSet.reduce(
          (accumulator, field) =>
            modifyValueObject(accumulator, field.name, field.value),
          newState
        );
      }

      // console.log(redactJSONObject(newState))

      return newState;
    });
  };
};
