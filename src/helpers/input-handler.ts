import type { Dispatch, SetStateAction } from 'react';

import { z } from 'zod';

// import { redactJSONObject } from "./logging";

// base without circular
const baseSettableValuesSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.undefined(),
]);

// main type
type settableValuesType =
  | z.infer<typeof baseSettableValuesSchema>
  | settableObjectType
  | settableArrayType;

// two circular types + node
type settableObjectType = { [key: string]: settableValuesType };
type settableArrayType = Array<settableValuesType>;
type settableNodeType = settableObjectType | settableArrayType;

// lazy load for zod circular (temporary values to avoid lint prefer-const error)
let settableObjectSchema: z.ZodType<settableObjectType> = z.object({});
let settableArraySchema: z.ZodType<settableArrayType> = z.array(z.string());

const settableValuesSchema: z.ZodType<settableValuesType> = z.union([
  baseSettableValuesSchema,
  z.lazy(() => settableObjectSchema),
  z.lazy(() => settableArraySchema),
]);

settableObjectSchema = z.record(
  z.string(),
  z.lazy(() => settableValuesSchema)
);
settableArraySchema = z.array(z.lazy(() => settableValuesSchema));

// type guards for circulars (nodes)
const isSettableObjectType = (unk: unknown): unk is settableObjectType => {
  const { success } = settableObjectSchema.safeParse(unk);
  return success;
};
const isSettableArrayType = (unk: unknown): unk is settableArrayType => {
  const { success } = settableArraySchema.safeParse(unk);
  return success;
};

// next node calculator (creates empty node if next doesn't exist or
// it isn't a node or it isn't the right node type)
const nextNodeToSet = (
  currentNode: settableNodeType,
  // current key is always initially string (it is part of the string path)
  currentKey: string,
  nextKey: string
): settableNodeType => {
  // for use if next node needs to be created (depending on next node type (string or number))
  const nextIsNum = !isNaN(parseInt(nextKey)) ? true : false;
  const nextEmptyNode = nextIsNum
    ? <settableArrayType>[]
    : <settableObjectType>{};

  // nextNode is narrowed to node later
  let nextNode: settableValuesType;
  if (isSettableObjectType(currentNode)) {
    nextNode = currentNode[currentKey];
  } else {
    const currentKeyInt = parseInt(currentKey);
    nextNode = currentNode[currentKeyInt];
  }

  // invalid next node type, set empty
  if (
    !nextNode ||
    (!isSettableArrayType(nextNode) && !isSettableObjectType(nextNode))
  ) {
    return nextEmptyNode;
  } else if (
    // next node is wrong type for next val, set empty
    (nextIsNum && !isSettableArrayType(nextNode)) ||
    (!nextIsNum && !isSettableObjectType(nextNode))
  ) {
    return nextEmptyNode;
  } else {
    // node is correct type, no change
    return nextNode;
  }
};

// actual object modifier function
const setObjPathVal = <T extends settableObjectType | settableArrayType>(
  obj: T,
  path: string,
  value: settableValuesType
): T => {
  // missing args
  if (!obj) return <T>{};
  if (!path || value === undefined) return obj;

  // split path
  const segments = path.split(/[.[\]]/g).filter((x) => !!x.trim());

  // setter
  const setNode = (node: settableNodeType): void => {
    // case 1: more nesting to handle
    if (segments.length > 1) {
      const key = segments.shift();
      if (!key) {
        throw '(should be) impossible error happened in object setter (key undefined)';
      }

      const nextSegment = segments[0];
      if (!nextSegment) {
        throw '(should be) impossible error happened in object setter (next segment undefined)';
      }

      // do next node
      setNode(nextNodeToSet(node, key, nextSegment));
    } else {
      // case 2: final node
      const finalKey = segments[0];
      if (!finalKey) {
        throw '(should be) impossible error happened in object setter (final key undefined)';
      }

      // obj or array?
      if (isSettableObjectType(node)) {
        node[finalKey] = value;
      } else {
        // must be array
        const finalKeyInt = parseInt(finalKey);
        node[finalKeyInt] = value;
      }
    }
  };

  // can't directly modify prev state, so just grab all of the props
  const newObj = { ...obj };
  setNode(newObj);

  return newObj;
};

// input handler maker function stuff

// object for other values to set
export type selectInputOptionValuesType = string | number;

export type selectInputOption = {
  value: selectInputOptionValuesType;
  name: string;
  alsoSet?: {
    name: string;
    value: settableValuesType;
  }[];
};

type eventType = {
  target: {
    name: string;
    value: settableValuesType;
  };
};
type valueConversionTypes = 'unchanged' | 'number' | false | true;

// type for custom inputHandlerFunc
export type inputHandlerFunc = (
  // event is just the properties needed from a standard input change event
  event: eventType,
  // convertValueTo is the value type that the event.target.value should be
  // forced to when saved in state
  convertValueTo: valueConversionTypes,
  // inputOptions is used for select input elements to enable changing of
  // multiple other values on select change. For instance, to add or remove
  // fields that are only relevant to a particular item in the Select element.
  inputOptions?: selectInputOption[]
) => void;

// formChangeHandlerFunc returns the input change handler specific
// to the setFormState func that is passed in
export const inputHandlerFuncMaker = <StateObject extends settableObjectType>(
  setFormState: Dispatch<SetStateAction<StateObject>>
): inputHandlerFunc => {
  return (
    event: eventType,
    convertValueTo: valueConversionTypes,
    inputOptions?: selectInputOption[]
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
