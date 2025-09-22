export const clientId = "trackit";

export enum Topic {
  RAW_LOGS = "raw-logs",
  CLEANED_LOGS = "cleaned-logs",
  SESSION_ENDED = "session-ended",
}

export enum GroupId {
  TRANSFORMERS = "transformers",
  PUSHERS = "pushers",
}
