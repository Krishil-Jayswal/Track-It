import { getSiteDefinition } from "./siteregistry";
import { CONTENT_EXTRACTED } from "./types";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;

  const url = new URL(tab.url || "");
  const site = getSiteDefinition(url.hostname);
  if (!site) return;

  chrome.scripting.executeScript({
    target: { tabId },
    files: [site.script],
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === CONTENT_EXTRACTED) {
    chrome.tabs.get(sender.tab?.id || NaN, (tab) => {
      const log = {
        title: tab.title,
        url: tab.url,
        content: message.content,
        timestamp: new Date().toISOString(),
      };
      // TODO: Send log to serve with auth Token.
      console.log(log);
    });
  }
});
