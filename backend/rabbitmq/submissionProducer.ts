import { getChannel } from "./rabbitmqClient";

const SUBMISSION_QUEUE = "submission_queue";

export const sendSubmissionJob = async (jobData: any) => {
  const channel = getChannel();

  await channel.assertQueue(SUBMISSION_QUEUE, { durable: true });

  channel.sendToQueue(
    SUBMISSION_QUEUE,
    Buffer.from(JSON.stringify(jobData)),
    { persistent: true },
  );

  console.log(` [x] Sent submission job: ${JSON.stringify(jobData.submissionId)}`);
};
