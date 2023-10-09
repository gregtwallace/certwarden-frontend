// formChangeHandlerFunc returns the input change handler specific
// to the setFormState func that is passed in
export const formChangeHandlerFunc = (setFormState) => {
  return (event, type) => {
    // new val based on the input type, default is to just
    // use event.target.value as-is
    var eventVal = event.target.value;
    if (type === 'number') {
      eventVal = parseInt(eventVal);
    } else if (type === 'checkbox') {
      eventVal = event.target.checked;
    }

    setFormState((prevState) => {
      let path = event.target.name.split('.');
      let val = eventVal;

      // deeper layers not supported
      if (path.length >= 4) {
        return 'error';
      }

      // 2nd nested layer
      if (path.length >= 3) {
        val = {
          ...prevState[path[0]][path[1]],
          [path[2]]: val,
        };
      }

      // 1st nested layer
      if (path.length >= 2) {
        val = {
          ...prevState[path[0]],
          [path[1]]: val,
        };
      }

      // top level
      val = {
        ...prevState,
        [path[0]]: val,
      };

      return val;
    });
  };
};
