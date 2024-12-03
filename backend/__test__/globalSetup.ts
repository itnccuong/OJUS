import { exec } from "child_process";
import util from "util";
import { cleanDatabase } from "./test_utils";

const execPromise = util.promisify(exec);

module.exports = async () => {
  console.log("Initializing resources...");
  // Clean up any existing containers
  const { stdout } = await execPromise(
    "docker ps -q --filter name=backend-mysql_test-1",
  );
  if (stdout.trim()) {
    await execPromise("docker rm -f backend-mysql_test-1");
  }

  await execPromise("docker compose up -d");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await execPromise("dotenv -e .env.test -- prisma migrate dev");
  await cleanDatabase();
  await execPromise("ts-node prisma/seed.ts");
};
