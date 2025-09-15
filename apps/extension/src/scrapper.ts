import { getSiteDefinition } from "./siteregistry";
import { Message, MessageType } from "./types";

const main = () => {
  const site = getSiteDefinition(window.location.hostname);
  if (!site) return;
  const content = site.extractor();
  const message: Message = {
    type: MessageType.CONTENT_EXTRACTED,
    content,
  };
  chrome.runtime.sendMessage(message);
};

main();
