import { getSiteDefinition } from "./siteregistry";
import { Message, MessageType } from "./types";

const Log_Server_Endpoint = "http://localhost:5000/logs";

let token: string;
chrome.storage.local.get("token").then((res) => {
  token = res.token;
});

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

chrome.runtime.onMessage.addListener((message: Message, sender) => {
  switch (message.type) {
    case MessageType.CONTENT_EXTRACTED: {
      chrome.tabs.get(sender.tab?.id || NaN, async (tab) => {
        const log = {
          title: tab.title,
          url: tab.url,
          content: message.content,
          timestamp: new Date().toISOString(),
        };
        const res = await fetch(Log_Server_Endpoint, {
          method: "POST",
          headers: {
            authorization: token,
          },
          body: JSON.stringify(log),
        });
        console.log(await res.text());
      });
      break;
    }
    case MessageType.SET_TOKEN: {
      chrome.storage.local.set({ token: message.token });
      token = message.token;
      break;
    }
  }
});
