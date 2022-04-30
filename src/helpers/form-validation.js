// return if the input field is valid
export const isFieldError = (errors, key) => errors.indexOf(key) !== -1;

// check if name is valid (only permitted to contain URL path chars)
export const isNameValid = (name) => {
  // don't allow blank name
  if (name.length === 0) {
    return false;
  };
  // match anything not valid ( A-Z, a-z, 0-9, -_.~ )
  const regex = /[^-_.~A-z0-9]|[\^]/g;
  if (name.match(regex)) {
    return false;
  } else {
    return true;
  };
};
