const defaultDateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

// unixTimeToString returns a human readable date/time in the format specified
// if no format specified, a default for just the date is used
export const unixTimeToString = (
  unixTime: number | null,
  dateTimeFormat: Intl.DateTimeFormatOptions = defaultDateFormat
): string => {
  if (unixTime === null) {
    return '';
  }

  if (unixTime <= 0) {
    return 'Never';
  }

  // Note: * 1000 due to millisecond conversion
  return new Intl.DateTimeFormat('en-US', dateTimeFormat).format(
    unixTime * 1000
  );
};

// function to return number of seconds until the specified time
export const secsUntil = (unixTime: number): number => {
  return unixTime - Math.floor(Date.now() / 1000);
};

// function to return number of days until the specified time
export const daysUntil = (unixTime: number): number => {
  return Math.floor(secsUntil(unixTime) / (3600 * 24));
};

// dateToPretty provides a pretty output for the client from a date
export const iso8601StringToPretty = (iso8601Time: string): string => {
  const date = new Date(iso8601Time);

  if (Number.isNaN(date.valueOf())) {
    return 'failed-to-parse-date';
  }

  return date.toLocaleString('en-US');
};
