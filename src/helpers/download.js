// downloadBlob
export const downloadBlob = (response) => {
  // create file link in browser's memory
  var href = URL.createObjectURL(response.data);

  // create "a" HTML element with href to file & click
  var link = document.createElement('a');
  link.href = href;

  // capture the filename from content-disposition
  const filenameRegex = /filename="(.*)"/;
  let filenameMatches = filenameRegex.exec(
    response.headers['content-disposition']
  );
  let filename = filenameMatches[1];
  link.setAttribute('download', filename);

  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
