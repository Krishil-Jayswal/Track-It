import { z } from "zod";

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

export enum OAUTH_TYPE {
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
}

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
});

export type Log = z.infer<typeof LogSchema>;
