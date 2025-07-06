import { Kafka, Consumer } from "kafkajs";
import { env } from "@repo/env";
import { clientId } from "./types.js";
const kafka = new Kafka({
  clientId,
  brokers: [env.KAFKA_URL],
});

export const producer = kafka.producer();
await producer.connect();

export const createConsumer = async (groupId: string): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  return consumer;
};
