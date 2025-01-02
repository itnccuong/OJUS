import { app } from "./app";
import fs from "fs";
import path from "path";

import { initRabbitMQ } from "../rabbitmq/rabbitmqClient";
import { startSubmissionConsumer } from "../rabbitmq/submissionConsumer";

const dir = path.join("codeFiles");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

(async () => {
  try {
 
    await initRabbitMQ();

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();