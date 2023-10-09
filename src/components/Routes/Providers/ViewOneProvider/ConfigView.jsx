import PropTypes from 'prop-types';

import { List, ListItem, ListItemText } from '@mui/material';

// keyPretty transforms an object key value such as 'some_key_val'
// by replacying underscores with spaces and capitalizing each
// word, yielding 'Some Key Val'
const keyPretty = (key) => {
  const words = key.split('_');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(' ');
};

// makeListObjects unnests an object and returns all key:value pairs
// regardless of nesting depth. It also discards any key named 'domains'
// since domains are handled elsewhere
const makeListObjects = (obj) => {
  var arr = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'domains') {
      // if key is 'domains'
      // no-op
    } else if (typeof value === 'object') {
      // if object, deconstruct further
      var keyValues = makeListObjects(value);
      arr.push(...keyValues);
    } else {
      // not object, append
      arr.push({ key: keyPretty(key), value: value });
    }
  }

  return arr;
};

const ConfigView = (props) => {
  return (
    <List dense={true}>
      {makeListObjects(props.config).map((elem) => (
        <ListItem key={elem.key}>
          <ListItemText primary={`${elem.key}: ${elem.value}`} />
        </ListItem>
      ))}
    </List>
  );
};

ConfigView.propTypes = {
  config: PropTypes.object.isRequired,
};

export default ConfigView;
