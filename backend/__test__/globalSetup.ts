import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs";

const execPromise = util.promisify(exec);

module.exports = async () => {
  console.log("Initializing resources...");
  const dir = path.join("codeFiles");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await execPromise("dotenv -e .env.test -- prisma migrate deploy");
};
