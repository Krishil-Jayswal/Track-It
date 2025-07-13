import { createConsumer } from "@repo/kafka";
import { GroupId, Topic } from "@repo/kafka/meta";
import { Log } from "@repo/validation";
import { html_transform } from "./html-transformer.js";
import { markdown_transform } from "./markdown-transformer.js";

export class LogTransformer {
  public static async start() {
    const consumer = await createConsumer(GroupId.LOGS_TRANSFORMERS);
    await consumer.subscribe({ topic: Topic.RAW_LOGS });
    consumer.run({
      eachMessage: async ({ message }) => {
        console.log({ offset: message.offset });
        const log: Log = JSON.parse(message.value?.toString() || "{}");
        log.content = await html_transform(log.content, log.url, {
          onlyMainContent: true,
          includeTags: [],
          excludeTags: [],
        });
        log.content = await markdown_transform(log.content);
        console.log(log);
      },
    });
  }
}
