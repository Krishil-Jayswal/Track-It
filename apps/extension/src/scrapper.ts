import { getSiteDefinition } from "./siteregistry";
import { CONTENT_EXTRACTED } from "./types";

const main = async () => {
  const site = getSiteDefinition(window.location.hostname);
  if (!site) return;
  const content = await site.extractor();
  chrome.runtime.sendMessage({
    type: CONTENT_EXTRACTED,
    content: content || "",
  });
};

main();
