import { env } from "@repo/env";
import express from "express";
import V1Router from "./routes/index.route.js";

const app = express();

app.use(express.json());

app.use("/api/v1", V1Router);

app.listen(env.HTTP_PORT, (error) => {
  if (error) {
    console.error("Error in starting server: ", error);
    process.exit(1);
  }

  console.log(`Server started at port ${env.HTTP_PORT}`);
});
