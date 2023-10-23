// import { redactJSONObject } from "./logging";

// modifyValueObject takes the original object and modifies the
// property with name and sets it to value
const modifyValueObject = (originalValueObject, name, value) => {
  let path = name.split('.');
  let newValueObject = value;

  // deeper layers not supported
  if (path.length >= 5) {
    return 'error';
  }

  // 3rd nested layer
  if (path.length >= 4) {
    newValueObject = {
      ...originalValueObject[path[0]][path[1]][path[2]],
      [path[3]]: newValueObject,
    };
  }

  // 2nd nested layer
  if (path.length >= 3) {
    newValueObject = {
      ...originalValueObject[path[0]][path[1]],
      [path[2]]: newValueObject,
    };
  }

  // 1st nested layer
  if (path.length >= 2) {
    newValueObject = {
      ...originalValueObject[path[0]],
      [path[1]]: newValueObject,
    };
  }

  // top level
  newValueObject = {
    ...originalValueObject,
    [path[0]]: newValueObject,
  };

  // if undefined value, delete the property
  if (value == undefined) {
    switch (path.length) {
      case 4:
        delete newValueObject[path[0]][path[1]][path[2]][path[3]];
        break;
      case 3:
        delete newValueObject[path[0]][path[1]][path[2]];
        break;
      case 2:
        delete newValueObject[path[0]][path[1]];
        break;
      case 1:
        delete newValueObject[path[0]];
        break;
    }
  }

  return newValueObject;
};

// formChangeHandlerFunc returns the input change handler specific
// to the setFormState func that is passed in
export const formChangeHandlerFunc = (setFormState) => {
  // event is the standard event object
  // type allows specifying how to parse the new target value
  // options is used by InputSelect to potentially set additional field values
  //   if changing the select alters other parts of the form
  return (event, type, options) => {
    // new val based on the input type, default is to just
    // use event.target.value as-is
    var eventVal = event.target.value;
    if (type === 'number') {
      eventVal = parseInt(eventVal);
    } else if (type === 'checkbox') {
      eventVal = event.target.checked;
    }

    // parse options to check for alsoSet values
    const alsoSet = options?.find((o) => o.value === eventVal)?.alsoSet;

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
