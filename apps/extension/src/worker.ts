import { getSiteDefinition } from "./siteregistry";
import { CONTENT_EXTRACTED } from "./types";

const Log_Server_Endpoint = "http://localhost:5000/logs";
const sessionId = crypto.randomUUID();

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
    chrome.tabs.get(sender.tab?.id || NaN, async (tab) => {
      const log = {
        sessionId,
        title: tab.title,
        url: tab.url,
        content: message.content,
        timestamp: new Date().toISOString(),
      };
      const res = await fetch(Log_Server_Endpoint, {
        method: "POST",
        body: JSON.stringify(log),
      });
      console.log(await res.text());
    });
  }
});
