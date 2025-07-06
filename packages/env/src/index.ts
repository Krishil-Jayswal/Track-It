import { EnvSchema } from "@repo/validation";
import { config } from "dotenv";
import path from "node:path";

const envPath = path.join(__dirname, "..", "..", "..", ".env");

config({ path: envPath });

export const env = EnvSchema.parse(process.env);
