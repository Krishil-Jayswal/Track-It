import { LoggableSite } from "./types";

const LOGGABLE_SITES: LoggableSite[] = [
  {
    url: "www.google.com",
    script: "dist/scrapper.js",
    extractor: () => {
      const element = document.querySelector(".LT6XE");
      return element?.innerHTML ?? "";
    },
  },
];

export const getSiteDefinition = (
  hostname: string,
): LoggableSite | undefined => {
  return LOGGABLE_SITES.find((site) => site.url === hostname);
};
