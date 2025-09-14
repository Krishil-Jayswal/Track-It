import { createConsumer } from "@repo/kafka/consumer";
import { GroupId, Topic } from "@repo/kafka/meta";
import { Log } from "@repo/validation";
import { upload } from "@repo/object-store";
import { join } from "node:path";

class Pusher {
  public static async start() {
    const consumer = await createConsumer(GroupId.PUSHERS);
    await consumer.subscribe({ topic: Topic.CLEANED_LOGS });
    consumer.run({
      eachMessage: async ({ message }) => {
        const log: Log = JSON.parse(message.value?.toString() || "{}");
        const key = join(log.userId, log.sessionId, `${log.id}.json`);
        const data: Omit<Log, "id" | "sessionId" | "userId"> = {
          title: log.title,
          url: log.url,
          content: log.content,
          timestamp: log.timestamp,
        };
        await upload(key, JSON.stringify(data));
      },
    });
  }
}

Pusher.start();
