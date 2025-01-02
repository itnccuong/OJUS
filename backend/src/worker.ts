// src/worker.ts
import { initRabbitMQ } from "../rabbitmq/rabbitmqClient";
import { startSubmissionConsumer } from "../rabbitmq/submissionConsumer";
import { initAllDockerContainers } from "../utils/codeExecutorUtils";

(async () => {
  try {
    await initAllDockerContainers();

    await initRabbitMQ();
    startSubmissionConsumer();
  } catch (err) {
    console.error("Failed to start consumer:", err);
    process.exit(1);
  }
})();
