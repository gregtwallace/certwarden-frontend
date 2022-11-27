// buildMethodsList is a helper function to take an array of methods
// an optional default MethodValue and return an array of options
// for a form.
export const buildMethodsList = (methods, defaultValue = '') => {
  // remove default if specified so it isn't listed twice
  if (defaultValue !== '') {
    methods = methods.filter((method) => method.value !== defaultValue);
  }

  // only methods that are enabled
  var enabledMethods = methods.filter((m) => m.enabled);

  enabledMethods = enabledMethods.map((m) => ({
    value: m.value,
    name: m.name + ' (' + m.type + ')',
  }));

  // only methods that are disabled
  var disabledMethods = methods.filter((m) => !m.enabled);

  disabledMethods = disabledMethods.map((m) => ({
    value: m.value,
    name: m.name + ' (' + m.type + ') [Disabled]',
  }));

  // return combo of enabled followed by diabled
  return enabledMethods.concat(disabledMethods);
};
