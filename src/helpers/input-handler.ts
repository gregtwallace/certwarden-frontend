import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { type SelectChangeEvent } from '@mui/material';

// import { redactJSONObject } from "./logging";

type stateValueTypes = string | number | object | boolean | undefined;
type valueConversionTypes = 'unchanged' | 'number' | false | true;

const setObjPathVal = <T extends object, K>(
  obj: T,
  path: string,
  value: K
): T => {
  // missing args
  if (!obj) return {} as T;
  if (!path || value === undefined) return obj;

  // split path
  const segments = path.split(/[.[\]]/g).filter((x) => !!x.trim());

  // setter
  const _set = (node: any): void => {
    if (segments.length > 1) {
      const key = segments.shift() as keyof typeof node;

      const nextIsNum = !isNaN(parseInt(segments[0] || 'not int'))
        ? false
        : true;

      if (node[key] !== undefined) {
        // no-op
      } else if (nextIsNum) {
        node[key] = [];
      } else {
        node[key] = {};
      }

      _set(node[key]);
    } else {
      const finalKey = segments[0] as keyof typeof node;
      if (!finalKey) {
        throw '(should be) impossible error happened in object setter';
      }
      node[finalKey] = value;
    }
  };

  const newObj = {...obj}
  _set(newObj);

  return newObj;
};

// input handler maker function stuff

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
export const inputHandlerFuncMaker = <
  StateObject extends Record<string, unknown>
>(
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
      // set new value
      let newState = setObjPathVal(prevState, event.target.name, value);

      // further modification if there are alsoSet values on inputOptions
      if (inputOptions) {
        const alsoSet = inputOptions?.find((o) => o.value === value)?.alsoSet;
        if (alsoSet != undefined) {
          newState = alsoSet.reduce(
            (accumulator, field) =>
              setObjPathVal(accumulator, field.name, field.value),
            newState
          );
        }
      }

      // console.log(redactJSONObject(newState))

      return newState;
    });
  };
};
