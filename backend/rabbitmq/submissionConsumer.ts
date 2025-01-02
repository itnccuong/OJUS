import { getChannel } from "./rabbitmqClient";
import { compileService, executeCodeService, updateSubmissionVerdict } from "../services/problem.services/judging.services"
import { CustomError } from "../utils/errorClass";
import { STATUS_CODE } from "../utils/constants";
import e from "express";

const SUBMISSION_QUEUE = "submission_queue";

export const startSubmissionConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue(SUBMISSION_QUEUE, { durable: true });

  channel.prefetch(1);

  console.log("[*] Waiting for messages in submission_queue.");

  channel.consume(
    SUBMISSION_QUEUE,
    async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          const { submissionId, code, language, problem_id, userId } = data;

          console.log(`[x] Received submission job #${submissionId}`);

          const filename = await compileService(code, language, submissionId);
          await executeCodeService(filename, language, submissionId, problem_id);

          await updateSubmissionVerdict(submissionId, "OK", "");

        //   console.log(`[x] Done Processes submission job #${submissionId}`);
          channel.ack(msg); 
        } catch (error) {
          console.error("Error processing submission job:", error);
          channel.nack(msg, false, false);
          if(error instanceof CustomError){
            return new CustomError(error.message, error.status, error.data);
          }
        }
      }
    },
    { noAck: false },
  );
};
