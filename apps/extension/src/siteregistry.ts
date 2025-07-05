import { LoggableSite } from "./types";

const waitForElement = (
  selector: string,
  timeout: number = 5000,
): Promise<Element | null> => {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  });
};

const LOGGABLE_SITES: LoggableSite[] = [
  {
    url: "www.google.com",
    script: "dist/scrapper.js",
    extractor: async () => {
      const element = await waitForElement(".LT6XE");
      return element?.innerHTML ?? "";
    },
  },
];

export const getSiteDefinition = (
  hostname: string,
): LoggableSite | undefined => {
  return LOGGABLE_SITES.find((site) => site.url === hostname);
};
