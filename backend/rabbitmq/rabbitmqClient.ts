import amqp from "amqplib";

let channel: amqp.Channel;

export const initRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    console.log("RabbitMQ: Connected and channel created.");
  } catch (err) {
    console.error("RabbitMQ connection error:", err);
    throw err;
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("Channel not initialized. Call initRabbitMQ() first.");
  }
  return channel;
};
