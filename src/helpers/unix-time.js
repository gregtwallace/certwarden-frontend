// function to convert unix time to something friendlier
export const convertUnixTime = (unixTime) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(unixTime * 1000);
  // Note: *1000 due to millisecond conversion
};
