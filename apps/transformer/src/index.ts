import { producer } from "@repo/kafka/producer";
import { createConsumer } from "@repo/kafka/consumer";
import { GroupId, Topic } from "@repo/kafka/meta";
import { Log } from "@repo/validation";
import { htmlTransform } from "./transformers/html-transformer.js";
import { markdownTransform } from "./transformers/markdown-transformer.js";

class LogTransformer {
  public static async start() {
    const consumer = await createConsumer(GroupId.TRANSFORMER);

    await consumer.subscribe({ topic: Topic.LOGS_RAW, fromBeginning: true });

    consumer.run({
      eachMessage: async ({ message }) => {
        const log: Log = JSON.parse(message.value?.toString() || "{}");
        log.content = htmlTransform(log.content, log.url, {
          onlyMainContent: true,
          includeTags: [],
          excludeTags: [],
        });
        log.content = await markdownTransform(log.content);
        await producer.send({
          topic: Topic.LOGS_CLEANED,
          messages: [{ value: JSON.stringify(log), key: log.userId }],
        });
      },
    });
  }
}

LogTransformer.start();
