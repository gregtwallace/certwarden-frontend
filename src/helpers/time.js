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

// function to return number of days until the specified time
export const daysUntil = (unixTime) => {
  if (!unixTime) {
    return ""
  }

  return Math.floor(((unixTime) - (Date.now() / 1000)) / (( 3600 * 24)))
};

// iso8601ToPretty provides a pretty output for the client from an iso8601
// timestamp
export const iso8601ToPretty = (iso8601Time) => {
  const date = new Date(iso8601Time)

  return date.toLocaleString('en-US')
}