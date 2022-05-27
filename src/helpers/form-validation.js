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
  };

  return true;
};

// check if an email address is in a valid email address format
export const isEmailValidOrBlank = (email) => {
  // blank is permissible
  if (email === "") {
    return true;
  };

  // valid email regex
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(regex)) {
    return true;
  };

  return false;
}
