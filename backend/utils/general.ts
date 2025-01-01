import path from "path";
import fs, { readFileSync } from "fs";
import axios from "axios";
// import AdmZip from "adm-zip";
import unzipper from "unzipper";
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
export const downloadTestcase = async (fileUrl: string): Promise<{ testcase: TestcaseInterface, testDir: string }> => {
  const filename = fileUrl.replace(/^.*[\\/]/, "");
  const testsDir = path.join(__dirname, "testcases");
  
  // Create a unique directory for each download to prevent conflicts
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  const testDir = path.join(testsDir, `${filename}_${uniqueId}`);

  // Create directories if they don't exist
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const zipPath = path.join(testDir, "testcase.zip");
  const extractedPath = path.join(testDir, "extracted");

  // Initialize the testcase object
  const testcase: TestcaseInterface = { input: [], output: [] };

  // Flag to track successful extraction
  let extractionSucceeded = false;

  // Start downloading and extracting
  const downloadPromise = axios.get(fileUrl, {
    responseType: "stream",
  }).then(response => {
    if (response.status !== 200) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);

    return new Promise<void>((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  });

  const extractPromise = downloadPromise.then(() => {
    return fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractedPath }))
      .promise()
      .then(() => {
        console.log(`Successfully extracted ZIP to ${extractedPath}`);
        extractionSucceeded = true;

        // Process extracted files
        const files = fs.readdirSync(extractedPath, "utf8");
        files.forEach((fileName: string) => {
          // console.log(`Processing file: ${fileName}`);
          const filePath = path.join(extractedPath, fileName);
          const parsedFilename = parseFilename(fileName);

          if (parsedFilename.type.includes("input")) {
            const inputData = fs.readFileSync(filePath, "utf8");
            testcase.input.push(inputData);
            // console.log(`Added input from ${fileName}`);
          } else if (parsedFilename.type.includes("output")) {
            const outputData = fs.readFileSync(filePath, "utf8");
            testcase.output.push(outputData);
            // console.log(`Added output from ${fileName}`);
          }
        });

        return testcase;
      });
  });

  // Wait for extraction to complete
  await extractPromise;

  // Cleanup: Delete the ZIP file only if extraction succeeded
  if (extractionSucceeded && fs.existsSync(zipPath)) {
    try {
      fs.unlinkSync(zipPath);
      console.log(`Deleted ZIP file at ${zipPath}`);
    } catch (deleteError) {
      console.error(`Failed to delete ZIP file at ${zipPath}:`, deleteError);
    }
  }

  return { testcase, testDir };
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
