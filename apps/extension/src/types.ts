export type LoggableSite = {
  url: string;
  script: string;
  extractor: () => Promise<string>;
};

export const CONTENT_EXTRACTED = "CONTENT_EXTRACTED";
