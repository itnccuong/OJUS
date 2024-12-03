import { exec } from "child_process";
import util from "util";
import { cleanDatabase } from "./test_utils";

const execPromise = util.promisify(exec);

module.exports = async () => {
  console.log("Initializing resources...");
  await cleanDatabase();
  await execPromise("ts-node prisma/seed.ts");
};
