import { env } from "@repo/env";
import { LogSchema } from "@repo/validation";

Bun.serve({
  port: env.LOG_PORT,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/logs") {
      try {
        const body = await req.json();
        const validation = LogSchema.safeParse(body);
        if (!validation.success) {
          return new Response("Invalid log format", { status: 400 });
        }
        // TODO: Put this in kafka
        console.log(validation.data);
        return new Response(
          JSON.stringify({ message: "Log created successfully." }),
          { status: 200 },
        );
      } catch (error) {
        console.log("Error in Injesting log: ", error as Error);
        return new Response(
          JSON.stringify({ message: "Internal server error" }),
          { status: 500 },
        );
      }
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Log Server started at port ${env.LOG_PORT}`);
