// for use to check if an edit form has been modified. apiGet will return a
// larger subset of fields than are in use by the form. this func will check
// if any of the form fields (subset) differ from the api call (superset)
export const isSubset = (superObj, subObj) => {
  return Object.keys(subObj).every(ele => {
      if (typeof subObj[ele] == 'object') {
          return isSubset(superObj[ele], subObj[ele]);
      }
      return subObj[ele] === superObj[ele]
  });
};
