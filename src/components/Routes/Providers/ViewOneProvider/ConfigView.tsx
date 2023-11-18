import { type FC } from 'react';

import { List, ListItem, ListItemText } from '@mui/material';

// keyPretty transforms an object key value such as 'some_key_val'
// by replacying underscores with spaces and capitalizing each
// word, yielding 'Some Key Val'
const keyPretty = (key: string): string => {
  const words = key.split('_');

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word) {
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
  }

  return words.join(' ');
};

// check if object is a string:? Record
const isRecord = (obj: unknown): obj is Record<string, unknown> => {
  if (!obj || typeof obj !== 'object') return false;

  if (Array.isArray(obj)) return false;

  if (Object.getOwnPropertySymbols(obj).length > 0) return false;

  return true;
};

// makeListObjects unnests an object and returns all key:value pairs
// regardless of nesting depth. It also discards any key named 'domains'
// since domains are handled elsewhere
const makeListObjects = (
  obj: Record<string, unknown>
): Record<string, unknown>[] => {
  const arr = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'domains') {
      // if key is 'domains'
      // no-op
    } else if (isRecord(value)) {
      // if object record, deconstruct further
      const keyValues = makeListObjects(value);
      arr.push(...keyValues);
    } else {
      // not object, append
      arr.push({ key: keyPretty(key), value: value });
    }
  }

  return arr;
};

type propTypes = {
  config: Record<string, unknown>;
};

const ConfigView: FC<propTypes> = (props) => {
  return (
    <List dense={true}>
      {makeListObjects(props.config).map((elem, index) => (
        <ListItem key={`${index}_${elem['key']}`}>
          <ListItemText primary={`${elem['key']}: ${elem['value']}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default ConfigView;
