export type LoggableSite = {
  url: string;
  script: string;
  extractor: () => string;
};

export const CONTENT_EXTRACTED = "CONTENT_EXTRACTED";
