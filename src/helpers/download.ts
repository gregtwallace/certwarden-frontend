import { type AxiosResponse } from 'axios';

// downloadBlob
export const downloadBlob = (response: AxiosResponse): void => {
  // create file link in browser's memory
  const href = window.URL.createObjectURL(response.data);

  // create "a" HTML element with href to file & click
  const link = document.createElement('a');
  link.href = href;

  // capture the filename from content-disposition
  const filenameRegex = /filename="(.*)"/;
  const filenameMatches = filenameRegex.exec(
    response.headers['content-disposition']
  );

  if (filenameMatches !== null && filenameMatches.length >= 2) {
    const filename = filenameMatches[1];
    if (filename) {
      link.setAttribute('download', filename);
    }
  }

  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  // use setTimeout due to potential issue with Firefox
  setTimeout(function () {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(href);
  }, 100);
};
