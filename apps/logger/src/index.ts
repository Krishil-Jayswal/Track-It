import { env } from "@repo/env";
import { LogSchema } from "@repo/validation";
import { producer } from "@repo/kafka/producer";
import { Topic } from "@repo/kafka/meta";

Bun.serve({
  port: env.LOGGER_PORT,
  routes: {
    "/logs": {
      POST: async (req) => {
        try {
          const body = await req.json();
          const validation = LogSchema.safeParse(body);
          if (!validation.success) {
            return new Response("Invalid log format", { status: 400 });
          }
          await producer.send({
            topic: Topic.RAW_LOGS,
            messages: [{ value: JSON.stringify(validation.data) }],
          });
          return new Response("Log created successfully", { status: 200 });
        } catch (error) {
          console.log("Error in Injesting log: ", error as Error);
          return new Response(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 },
          );
        }
      },
    },
  },
});

console.log(`Log Server started at port ${env.LOGGER_PORT}`);
