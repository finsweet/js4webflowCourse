/**
 * This JSDoc comment is used to describe the purpose of the function.
 * @param url - This is a description of the function parameter:
 */
export const fetchCodeListing = (url: string, listing: HTMLDivElement) => {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      const selector = '[var="code-text"]';
      const codeText = listing.querySelector<HTMLDivElement>(selector);
      if (!codeText) return;
      const fomartedCode = convertSpaces(js_beautify(xmlhttp.responseText));
      codeText.innerHTML = fomartedCode;
    }
  };
  xmlhttp.open('GET', url, false);
  xmlhttp.send();
};

export const convertSpaces = (str: string) => {
  return str.replace(/ /g, '&nbsp').replace(/\n/g, '<br/>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;<br/>');
};
