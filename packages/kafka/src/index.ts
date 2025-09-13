import { Kafka, Consumer } from "kafkajs";
import { env } from "@repo/env";
import { clientId } from "./meta.js";

export const kafka = new Kafka({
  clientId,
  brokers: [env.KAFKA_URL],
});
