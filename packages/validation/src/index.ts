import { z } from "zod";

// Zod Schemas
export const LogSchema = z.strictObject({
  title: z.string(),
  url: z.string().url(),
  content: z.string(),
  timestamp: z.string().datetime(),
});

export const OAuthCallbackSchema = z.object({
  code: z.string(),
  state: z.string(),
});

export const EnvSchema = z.object({
  LOGGER_PORT: z.string().default("Logger server port."),
  API_PORT: z.string().default("API server port."),

  KAFKA_URL: z.string().default("Kafka cluster url."),
  REDIS_URL: z.string().default("Redis url"),
  DATABASE_URL: z.string().default("Database Url"),

  CLIENT_URL: z.string().default("Frontend Url"),

  JWT_USER_SECRET: z.string().default("JWT secret for user token"),
  JWT_EXT_SECRET: z.string().default("JWT secret for extension token"),
  JWT_EXPIRES_IN: z.string().default("JWT expiration time in number"),

  GOOGLE_CLIENT_ID: z.string().default("Google oauth client Id."),
  GOOGLE_CLIENT_SECRET: z.string().default("Google oauth client Secret."),

  BASE_REDIRECT_URL: z.string().default("Base redirect url."),

  ABS_CONNECTION_URL: z.string().default("Azure blob connection url"),
  ABS_CONTAINER_NAME: z.string().default("Azure blob container name."),

  GROQ_API_KEY: z.string().default("Groq cloud api key."),
});

// Enums
export enum OAUTH_TYPE {
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
}

// Types
export type LogData = z.infer<typeof LogSchema>;
export type Log = LogData & { id: string; userId: string };
export type Session = {
  userId: string;
  sessionId: string;
};
export type LLMResponse = SessionSummary & { content: string };
type SessionSummary = {
  summary: string;
  tags: string[];
};
export type SessionMetadata = SessionSummary & Session;
