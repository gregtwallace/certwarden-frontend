import type { Dispatch, SetStateAction } from 'react';

import { z } from 'zod';

import { isInteger } from './form-validation';
// import { redactJSONObject } from './logging';

// input nodes
const objectNode = z.record(z.string(), z.unknown());
const arrayNode = z.array(z.unknown());
const node = z.union([objectNode, arrayNode]);

type objectNodeType = z.infer<typeof objectNode>;
type arrayNodeType = z.infer<typeof arrayNode>;
type nodeType = z.infer<typeof node>;

// type guards for circulars (nodes)
const isObjectNodeType = (unk: unknown): unk is objectNodeType => {
  const { success } = objectNode.safeParse(unk);
  return success;
};
const isArrayNodeType = (unk: unknown): unk is arrayNodeType => {
  const { success } = arrayNode.safeParse(unk);
  return success;
};

// next node calculator (creates empty node if next doesn't exist or
// it isn't a node or it isn't the right node type)
const nextNodeToSet = (
  currentNode: nodeType,
  // current key is always initially string (it is part of the string path)
  currentKey: string,
  nextKey: string
): nodeType => {
  // for use if next node needs to be created (depending on next node type (string or number))
  const nextIsNum = isInteger(nextKey) ? true : false;
  const nextEmptyNode = nextIsNum
    ? ([] as arrayNodeType)
    : ({} as objectNodeType);

  // nextNode is narrowed to node later
  let nextNode: unknown;
  if (isObjectNodeType(currentNode)) {
    nextNode = currentNode[currentKey];
  } else {
    const currentKeyInt = parseInt(currentKey);
    nextNode = currentNode[currentKeyInt];
  }

  // invalid next node type, set empty
  if (
    !nextNode ||
    (!isArrayNodeType(nextNode) && !isObjectNodeType(nextNode))
  ) {
    return nextEmptyNode;
  } else if (
    // next node is wrong type for next val, set empty
    (nextIsNum && !isArrayNodeType(nextNode)) ||
    (!nextIsNum && !isObjectNodeType(nextNode))
  ) {
    return nextEmptyNode;
  } else {
    // node is correct type, no change
    return nextNode;
  }
};

// actual object modifier function
const setObjPathVal = <T extends nodeType>(
  obj: T,
  path: string,
  value: unknown
): T => {
  // missing args
  if (!obj) return {} as T;
  if (!path) return obj;

  // split path
  const segments = path.split(/[.[\]]/g).filter((x) => !!x.trim());

  // setter
  const setNode = (node: nodeType): void => {
    // case 1: more nesting to handle
    if (segments.length > 1) {
      const key = segments.shift();
      if (!key) {
        throw new Error(
          '(should be) impossible error happened in object setter (key undefined)'
        );
      }

      const nextSegment = segments[0];
      if (!nextSegment) {
        throw new Error(
          '(should be) impossible error happened in object setter (next segment undefined)'
        );
      }

      // do next node
      setNode(nextNodeToSet(node, key, nextSegment));
    } else {
      // case 2: final node
      const finalKey = segments[0];
      if (!finalKey) {
        throw new Error(
          '(should be) impossible error happened in object setter (final key undefined)'
        );
      }

      // if undefined delete final key; if defined, assign value
      // finalKey depends on final node type
      if (isObjectNodeType(node)) {
        if (value === undefined) {
          // NOTE: Doesn't work; node reverts
          // create a new record without the key that needs to be deleted
          // console.log('delete obj ' + finalKey);
          // const filteredNode = {} as Record<string, unknown>;
          // for (const key in node) {
          //   if (key !== finalKey) {
          //     filteredNode[key] = node[key];
          //   }
          // }
          // node = filteredNode;

          delete node[finalKey];
        } else {
          node[finalKey] = value;
        }
      } else {
        // must be array
        const finalKeyInt = parseInt(finalKey);
        if (value === undefined) {
          node.splice(finalKeyInt, 1);
        } else {
          node[finalKeyInt] = value;
        }
      }
    }
  };

  // avoid deep copy issues - use json stringify and then parse back to a new object
  const json = JSON.stringify(obj);
  const newObj = JSON.parse(json) as T;

  setNode(newObj);

  return newObj;
};

// input handler maker function stuff

// object for other values to set
export type selectInputOptionValuesType = string | number;

export type alsoSetType = {
  name: string;
  value: unknown;
};

export type selectInputOption<ValType extends selectInputOptionValuesType> = {
  value: ValType;
  name: string;
  alsoSet?: alsoSetType[] | undefined;
};

type eventType = {
  target: {
    name: string;
    value: unknown;
  };
};
type valueConversionTypes = 'unchanged' | 'number' | false | true;

// type for custom inputHandlerFunc
export type inputHandlerFuncType = (
  // event is just the properties needed from a standard input change event
  event: eventType,
  // convertValueTo is the value type that the event.target.value should be
  // forced to when saved in state
  convertValueTo: valueConversionTypes,
  // inputOptions is used for select input elements to enable changing of
  // multiple other values on select change. For instance, to add or remove
  // fields that are only relevant to a particular item in the Select element.
  inputOptions?: selectInputOption<selectInputOptionValuesType>[]
) => void;

// formChangeHandlerFunc returns the input change handler specific
// to the setFormState func that is passed in
export const inputHandlerFuncMaker = <StateObject extends objectNodeType>(
  setFormState: Dispatch<SetStateAction<StateObject>>
): inputHandlerFuncType => {
  return (
    event: eventType,
    convertValueTo: valueConversionTypes,
    inputOptions?: selectInputOption<selectInputOptionValuesType>[]
  ) => {
    // set newVal to the real value to store in state
    const inputValue = event.target.value;
    let value: unknown = inputValue;

    // attempt to convert value if needed
    if (convertValueTo === 'number') {
      value = Number(inputValue);
    } else if (convertValueTo === true || convertValueTo === false) {
      value = convertValueTo;
    }

    setFormState((prevState) => {
      // set new value
      prevState = setObjPathVal(prevState, event.target.name, value);

      // further modification if there are alsoSet values on inputOptions
      if (inputOptions) {
        const alsoSet = inputOptions?.find((o) => o.value === value)?.alsoSet;
        if (alsoSet != undefined) {
          alsoSet.forEach((fieldValObj) => {
            prevState = setObjPathVal(
              prevState,
              fieldValObj.name,
              fieldValObj.value
            );
          });
        }
      }

      return prevState;
    });
  };
};
