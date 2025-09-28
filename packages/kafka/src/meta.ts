export const clientId = "trackit";

export enum Topic {
  LOGS_RAW = "logs.raw",
  LOGS_CLEANED = "logs.cleaned",
  SESSION_ENDED = "session.ended",
  SESSION_SUMMARIZED = "session.summarized",
}

export enum GroupId {
  TRANSFORMER = "transformer",
  PUSHER = "pusher",
  SUMMARIZER = "summarizer",
}
