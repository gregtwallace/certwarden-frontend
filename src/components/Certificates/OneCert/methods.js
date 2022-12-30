const methodOption = (method, current) => {
  return {
    value: method.value,
    name:
      method.name + ' (' + method.type + ')' + (!method.enabled ? ' [Disabled]' : '') + (current ? ' - Current' : ''),
  };
};

// buildMethodsList is a helper function to take an array of methods
// an optional current Method and returns an array of options
// for a form.
export const buildMethodsList = (methods, currentMethod = null) => {
  // variable to hold ordered methods
  var methodsList = [];

  // 1st current method (if specified)
  if (currentMethod != null) {
    // remove default from the array of all options
    methods = methods.filter((method) => method.value !== currentMethod.value);

    // start returned list with the default value
    methodsList = methodsList.concat(methodOption(currentMethod, true));
  }

  // 2nd methods that are enabled
  var enabledMethods = methods.filter((m) => m.enabled);
  enabledMethods = enabledMethods.map((m) => methodOption(m));

  methodsList = methodsList.concat(enabledMethods);

  // 3rd methods that are disabled
  var disabledMethods = methods.filter((m) => !m.enabled);
  disabledMethods = disabledMethods.map((m) => methodOption(m));

  methodsList = methodsList.concat(disabledMethods);

  return methodsList;
};
