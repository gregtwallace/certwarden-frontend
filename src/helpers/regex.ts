// function to escape all regex chars in a string
export const escapeStringForRegExp = (s: string): string => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
