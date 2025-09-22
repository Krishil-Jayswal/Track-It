import { createConsumer } from "@repo/kafka/consumer";
import { GroupId, Topic } from "@repo/kafka/meta";
import { Log } from "@repo/validation";
import { upload } from "@repo/object-store";
import { join } from "node:path";
import { SessionManager } from "./managers/session.manager.js";

class Pusher {
  public static async start() {
    const consumer = await createConsumer(GroupId.PUSHERS);

    await consumer.subscribe({ topic: Topic.CLEANED_LOGS });

    consumer.on(consumer.events.GROUP_JOIN, async (e) => {
      const topics = e.payload.memberAssignment;
      SessionManager.getInstance().rebalance(topics[Topic.CLEANED_LOGS] || []);
    });

    consumer.run({
      eachMessage: async ({ message, partition }) => {
        const log: Log = JSON.parse(message.value?.toString() || "{}");
        const sessionId = await SessionManager.getInstance().add(
          partition,
          log.userId,
        );
        const key = join(
          log.userId,
          new Date(log.timestamp).toISOString().split("T")[0]!,
          sessionId,
          `${log.id}.json`,
        );
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
