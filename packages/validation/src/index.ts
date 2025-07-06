import { z } from "zod";

export const LogSchema = z.strictObject({
  title: z.string(),
  url: z.string().url(),
  content: z.string(),
  timestamp: z.string().datetime(),
});

export const EnvSchema = z.object({
  LOG_PORT: z.string().default("Your Log server port."),
  KAFKA_URL: z.string().default("Your Kafka cluster url."),
});
