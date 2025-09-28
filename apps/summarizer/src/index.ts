import { producer } from "@repo/kafka/producer";
import { createConsumer } from "@repo/kafka/consumer";
import { GroupId, Topic } from "@repo/kafka/meta";
import { fetchSessionLogs, upload } from "@repo/object-store";
import { Session, SessionMetadata } from "@repo/validation";
import { join } from "node:path";
import { LLMCall } from "./utils/llm.js";

class Summarizer {
  public static async start() {
    const consumer = await createConsumer(GroupId.SUMMARIZER);

    await consumer.subscribe({
      topic: Topic.SESSION_ENDED,
      fromBeginning: true,
    });

    consumer.run({
      eachMessage: async ({ message }) => {
        const session: Session = JSON.parse(message.value?.toString() || "{}");
        const sessionKey = `${session.userId}/${session.sessionId}/logs`;
        const articleKey = join(
          session.userId,
          session.sessionId,
          "article.md",
        );
        const logs = await fetchSessionLogs(sessionKey);
        const response = await LLMCall(logs);
        const sessionMetadata: SessionMetadata = {
          userId: session.userId,
          sessionId: session.sessionId,
          summary: response.summary,
          tags: response.tags,
        };
        await upload(articleKey, response.content);
        await producer.send({
          topic: Topic.SESSION_SUMMARIZED,
          messages: [{ value: JSON.stringify(sessionMetadata) }],
        });
      },
    });
  }
}

Summarizer.start();
