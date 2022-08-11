// function to convert unix time to something friendlier
export const convertUnixTime = (unixTime) => {
  if (!unixTime) {
    return ""
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    // keeping for convenience when testing and need full time
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
  }).format(unixTime * 1000);
  // Note: *1000 due to millisecond conversion
};
