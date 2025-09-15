export type LoggableSite = {
  url: string;
  script: string;
  extractor: () => string;
};

export enum MessageType {
  CONTENT_EXTRACTED = "CONTENT_EXTRACTED",
  SET_TOKEN = "SET_TOKEN",
}

export type Message =
  | {
      type: MessageType.CONTENT_EXTRACTED;
      content: string;
    }
  | {
      type: MessageType.SET_TOKEN;
      token: string;
    };
