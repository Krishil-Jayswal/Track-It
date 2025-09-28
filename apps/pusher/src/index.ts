import { createConsumer } from "@repo/kafka/consumer";
import { GroupId, Topic } from "@repo/kafka/meta";
import { Log, LogData } from "@repo/validation";
import { upload } from "@repo/object-store";
import { join } from "node:path";
import { SessionManager } from "./managers/session.manager.js";

class Pusher {
  public static async start() {
    const consumer = await createConsumer(GroupId.PUSHER);

    await consumer.subscribe({
      topic: Topic.LOGS_CLEANED,
      fromBeginning: true,
    });

    consumer.on(consumer.events.GROUP_JOIN, async (e) => {
      const topics = e.payload.memberAssignment;
      await SessionManager.getInstance().rebalance(
        topics[Topic.LOGS_CLEANED] || [],
      );
    });

    consumer.run({
      eachMessage: async ({ message, partition }) => {
        const log: Log = JSON.parse(message.value?.toString() || "{}");
        const sessionId = await SessionManager.getInstance().add(
          partition,
          log.userId,
        );
        const logKey = join(log.userId, sessionId, "logs", `${log.id}.json`);
        const data: LogData = {
          title: log.title,
          url: log.url,
          content: log.content,
          timestamp: log.timestamp,
        };
        await upload(logKey, JSON.stringify(data));
      },
    });
  }
}

Pusher.start();
