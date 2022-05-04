import { fetchCodeListing, convertSpaces } from '$utils/log';

// Starter example. Check the comments!
document.addEventListener('DOMContentLoaded', () => {
  const LISTING_SELECTOR = '[var="listing"]';
  const CONTENT_SELECTOR = '[var="content"]';
  const SENDLIVE_SELECTOR = '[var="go-live"]';
  const DEMO_LISTING_SELECTOR = '[var="demo-listing"]';
  const RUN_SELECTOR = '[var="run"]';
  const RESET_SELECTOR = '[var="reset"]';
  const INSTRUCTIONS_SELECTOR = '[var="instructions"]';
  const DEMO_SELECTOR = '[var="demodiv"]';

  // get elements from the DOM
  const listing = document.querySelector<HTMLDivElement>(LISTING_SELECTOR);
  const content = document.querySelector<HTMLDivElement>(CONTENT_SELECTOR);
  const demoListing = document.querySelector<HTMLDivElement>(DEMO_LISTING_SELECTOR);
  const runButton = document.querySelector<HTMLButtonElement>(RUN_SELECTOR);
  const instructions = document.querySelector<HTMLDivElement>(INSTRUCTIONS_SELECTOR);
  const resetButton = document.querySelector<HTMLButtonElement>(RESET_SELECTOR);
  const demo = document.querySelector<HTMLDivElement>(DEMO_SELECTOR);

  if (!listing || !content || !demoListing || !runButton || !instructions || !resetButton || !demo) return;

  const templateCode = demoListing.innerText;
  // make instructions visible
  instructions.style.opacity = '0';
  // set content from github urls
  const code_listing_template = listing.cloneNode(true) as HTMLDivElement;
  const urlRegex = /(https?:\/\/[^\s]+js)/g;
  content.innerHTML =
    content.innerHTML.replace(urlRegex, function (url) {
      code_listing_template.setAttribute('url', url);
      fetchCodeListing(url, code_listing_template);
      return code_listing_template.outerHTML;
    }) || '';

  listing.remove();
  const sendLiveButtons = content.querySelectorAll(SENDLIVE_SELECTOR);

  // Listener for the send live buttons
  sendLiveButtons.forEach((button) => {
    button.addEventListener('click', function sendLive(this: HTMLDivElement) {
      // get the code from the content
      const code =
        this.closest<HTMLDivElement>('[var="listing"]')?.querySelector<HTMLDivElement>('[var="code-text"]')
          ?.innerText || '';
      // add instructions div
      instructions.innerText = code.split('\n')[0]?.replace('//', '').trim() || '';
      instructions.style.opacity = '1';
      // add code to the demo div
      const templateCodeXT = templateCode.replace(/<script>/, '').replace(/<\/script>/, '');

      demoListing.innerHTML =
        '<pre>&lt;script&gt;<br/>' +
        convertSpaces(js_beautify(templateCodeXT.replace('XT1', code))) +
        '<br/>&lt;/script&gt;</pre>';
      console.log(js_beautify(templateCodeXT.replace('XT1', code)));
      hljs.highlightBlock(demoListing);
    });
  });

  // Listener for the run button
  runButton.addEventListener('click', function () {
    let code = demoListing?.innerText || '';
    code = code.replace(/<\/?[^>]+(>|$)/g, '');
    eval(code);
  });

  // Listener for the reset button
  resetButton.addEventListener('click', function () {
    location.reload();
  });
});
