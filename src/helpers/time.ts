// locale is a func instead of a const for testing purposes
const getLocale = () =>
  (navigator.languages.length > 0 ? navigator.languages : navigator.language) ||
  'en-US';

const dateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'shortOffset',
};

// type for what type of date string to render
type dateStringType = 'dateOnly' | 'timeOnly' | 'both';

// unixTimeToStandardizedString parses the provided unix date value and then
// returns a standardized date string based on the user's locale. Optionally, if "omitTime"
// is true, the returned string will only contain the date.
// TODO: Hopefully this can go away.
export const unixTimeToStandardizedString = (
  unixTime: number,
  content: dateStringType = 'both',
) => {
  // Note: * 1000 due to millisecond conversion
  const date = new Date(unixTime * 1000);

  return dateToStandardizedString(date, content);
};

// dateToStandardizedString returns the standardized string for a given
// date object. It is normalized to the user's locale. Optionally, "content" can be
// set to return a string that is just the date, just the time, or (default) both.
export const dateToStandardizedString = (
  date: Date,
  content: dateStringType = 'both',
): string => {
  if (content === 'dateOnly') {
    return date.toLocaleDateString(getLocale(), dateFormat);
  }

  if (content === 'timeOnly') {
    return date.toLocaleTimeString(getLocale(), timeFormat);
  }

  return date.toLocaleString(getLocale(), { ...timeFormat, ...dateFormat });
};
