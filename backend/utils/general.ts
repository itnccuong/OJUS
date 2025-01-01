import path from "path";
import fs, { readFileSync } from "fs";
import axios from "axios";
import AdmZip from "adm-zip";
import { TestcaseInterface } from "../interfaces/code-executor-interface";

export const parseFilename = (filename: string) => {
  let type = "";
  let number = 0;
  let i = 0;

  // Extract type (e.g., "input" or "output")
  while (i < filename.length && isNaN(Number(filename[i]))) {
    type += filename[i];
    i++;
  }

  // Extract number
  while (i < filename.length && !isNaN(Number(filename[i]))) {
    number = number * 10 + Number(filename[i]);
    i++;
  }

  return { type, number };
};
export const downloadTestcase = async (fileUrl: string) => {
  //Get file's name from url. Example: http://myDir/abc.cpp -> abc.cpp
  const filename = fileUrl.replace(/^.*[\\/]/, "");
  const testsDir = path.join(__dirname, "testcases");
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir);
  }

  const testDir = path.join(testsDir, filename);
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  const zipPath = path.join(testDir, "testcase.zip");
  const extractedPath = path.join(testDir, "extracted");

  try {
    //Download the ZIP file
    const response = await axios.get(fileUrl, {
      responseType: "stream",
    });

    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    //Unzip the file
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractedPath, true);

    const testcase: TestcaseInterface = { input: [], output: [] };
    const files = fs.readdirSync(extractedPath, "utf8");
    files.forEach((fileName: string) => {
      const filePath = path.join(extractedPath, fileName);
      const parsedFilename = parseFilename(fileName);
      // console.log(filePath);
      const file = readFileSync(filePath, "utf-8");
      if (parsedFilename.type === "input") {
        testcase["input"][parsedFilename.number - 1] = file;
      }
      if (parsedFilename.type === "output") {
        testcase.output[parsedFilename.number - 1] = file;
      }
    });
    return testcase;
  } finally {
    if (fs.existsSync(zipPath)) {
      try {
        fs.unlinkSync(zipPath);
        console.log(`Deleted ZIP file at ${zipPath}`);
      } catch (deleteError) {
        console.error(`Failed to delete ZIP file at ${zipPath}:`, deleteError);
      }
    }
  }
};
//Create new file in codeFiles directory from submitted code
export const saveCodeToFile = (
  prefix: number,
  code: string,
  language: string,
) => {
  //Use submissionId to generate unique filename
  const filename = `${prefix}.${language}`;

  const filePath = path.join("codeFiles", filename);
  fs.writeFileSync(filePath, code, { encoding: "utf-8" });
  return filename;
};
