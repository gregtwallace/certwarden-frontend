import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { type SelectChangeEvent } from '@mui/material';

import { z } from 'zod';

// import { redactJSONObject } from "./logging";

type valueConversionTypes = 'unchanged' | 'number' | false | true;

// modify an object in place using its path
// WARNING: IF CHANGE TYPES, MANUALLY UPDATE ZOD consts too!
type settableValuesType =
  | string
  | number
  | boolean
  | settableObjectType
  | settableArrayType
  | undefined;
// WARNING SEE ABOVE
type settableObjectType = { [key: string]: settableValuesType };
type settableArrayType = Array<settableValuesType>;

let settableObject: z.ZodType<settableObjectType>;
let settableArray: z.ZodType<settableArrayType>;

// WARNING: SEE ABOVE - must stay in sync with above types
const settableValues: z.ZodType<settableValuesType> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => settableObject),
  z.lazy(() => settableArray),
  z.undefined(),
]);
settableObject = z.record(
  z.string(),
  z.lazy(() => settableValues)
);
settableArray = z.array(z.lazy(() => settableValues));

const isSettableObjectType = (unk: unknown): unk is settableObjectType => {
  const { success } = settableObject.safeParse(unk);
  return success;
};
const isSettableArrayType = (unk: unknown): unk is settableArrayType => {
  const { success } = settableArray.safeParse(unk);
  return success;
};

// const settableValues: z.ZodType<settableValuesType> = z.lazy()

const setObjPathVal = <T extends settableObjectType | settableArrayType>(
  obj: T,
  path: string,
  value: settableValuesType
): T => {
  // missing args
  if (!obj) return {} as T;
  if (!path || value === undefined) return obj;

  // split path
  const segments = path.split(/[.[\]]/g).filter((x) => !!x.trim());

  // setter
  const _set = (node: settableValuesType): void => {
    // more nesting to do

    if (segments.length > 1) {
      const key = segments.shift();
      if (!key) {
        throw '(should be) impossible error happened in object setter (key undefined)';
      }

      const nextSegment = segments[0];
      if (!nextSegment) {
        throw '(should be) impossible error happened in object setter (next segment undefined)';
      }

      const nextIsNum = !isNaN(parseInt(nextSegment)) ? true : false;

      // set next node based on next segment type (string or number)
      if (isSettableObjectType(node)) {
        // make new node if doesn't exist
        // or make new if it isn't the right kind
        if (
          !node[key] ||
          (nextIsNum && !isSettableArrayType(node[key])) ||
          (!nextIsNum && !isSettableObjectType(node[key]))
        ) {
          node[key] = nextIsNum
            ? <settableArrayType>[]
            : <settableObjectType>{};
        }

        _set(node[key]);
      } else if (isSettableArrayType(node)) {
        // make new node if doesn't exist
        // or make new if it isn't the right kind
        const keyInt = parseInt(key);
        if (
          !node[keyInt] ||
          (nextIsNum && !isSettableArrayType(node[keyInt])) ||
          (!nextIsNum && !isSettableObjectType(node[keyInt]))
        ) {
          node[keyInt] = nextIsNum
            ? <settableArrayType>[]
            : <settableObjectType>{};
        }

        _set(node[keyInt]);
      } else {
        throw '(should be) impossible error happened in object setter (node is not object or array)';
      }
    } else {
      // set final val
      const finalKey = segments[0];
      if (!finalKey) {
        throw '(should be) impossible error happened in object setter (final key undefined)';
      }

      // obj or array?
      if (isSettableObjectType(node)) {
        node[finalKey] = value;
      } else if (isSettableArrayType(node)) {
        const finalKeyInt = parseInt(finalKey);
        node[finalKeyInt] = value;
      } else {
        throw '(should be) impossible error happened in object setter (final node is not object or array)';
      }
    }
  };

  // can't directly modify prev state, so just grab all of the props
  const newObj = { ...obj };
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
    value: settableValuesType;
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
export const inputHandlerFuncMaker = <StateObject extends settableObjectType>(
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
    let value: settableValuesType = inputValue;

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
