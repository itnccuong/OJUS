"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProblemStatus = exports.createResult = exports.updateSubmissionVerdict = exports.saveCodeToFile = exports.downloadTestcase = exports.findFileById = exports.getContainerId = exports.findProblemById = exports.createSubmission = void 0;
const error_1 = require("../../utils/error");
const fs_1 = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const path_1 = __importDefault(require("path"));
const general_1 = require("../../utils/general");
const constants_1 = require("../../utils/constants");
const client_1 = __importDefault(require("../../prisma/client"));
const createSubmission = (problem_id, userId, code, language) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = yield client_1.default.submission.create({
        data: {
            problemId: problem_id,
            userId: userId,
            code: code,
            language: language,
            verdict: "",
            stderr: "",
        },
    });
    return submission;
});
exports.createSubmission = createSubmission;
const findProblemById = (problem_id) => __awaiter(void 0, void 0, void 0, function* () {
    const problem = yield client_1.default.problem.findUnique({
        where: {
            problemId: problem_id,
        },
    });
    if (!problem) {
        // throw new FindByIdError("Problem not found", problem_id, "Problem");
        throw new error_1.CustomError("PROBLEM_NOT_FOUND", "Problem not found in database!", constants_1.STATUS_CODE.NOT_FOUND, {
            problemId: problem_id,
        });
    }
    return problem;
});
exports.findProblemById = findProblemById;
const getContainerId = (container) => {
    const containerId = container.id;
    if (!containerId) {
        throw new error_1.CustomError("NOT_FOUND", "Container id not found", constants_1.STATUS_CODE.BAD_REQUEST, {});
    }
    return containerId;
};
exports.getContainerId = getContainerId;
const findFileById = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield client_1.default.files.findUnique({
        where: {
            fileId: fileId,
        },
    });
    if (!file) {
        throw new error_1.CustomError("FILE_NOT_FOUND", "File not found in database!", constants_1.STATUS_CODE.NOT_FOUND, {
            fileId: fileId,
        });
    }
    return file;
});
exports.findFileById = findFileById;
const downloadTestcase = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    //Get file's name from url. Example: http://myDir/abc.cpp -> abc.cpp
    const filename = fileUrl.replace(/^.*[\\/]/, "");
    const testsDir = path_1.default.join(__dirname, "testcases");
    if (!fs_1.default.existsSync(testsDir)) {
        fs_1.default.mkdirSync(testsDir);
    }
    const testDir = path_1.default.join(testsDir, filename);
    if (!fs_1.default.existsSync(testDir)) {
        fs_1.default.mkdirSync(testDir);
    }
    const zipPath = path_1.default.join(testDir, "testcase.zip");
    const extractedPath = path_1.default.join(testDir, "extracted");
    //Download the ZIP file
    const response = yield axios_1.default.get(fileUrl, {
        responseType: "stream",
    });
    const writer = fs_1.default.createWriteStream(zipPath);
    response.data.pipe(writer);
    yield new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
    //Unzip the file
    const zip = new adm_zip_1.default(zipPath);
    zip.extractAllTo(extractedPath, true);
    const testcase = { input: [], output: [] };
    const files = fs_1.default.readdirSync(extractedPath, "utf8");
    files.forEach((fileName) => {
        const filePath = path_1.default.join(extractedPath, fileName);
        const parsedFilename = (0, general_1.parseFilename)(fileName);
        const file = (0, fs_1.readFileSync)(filePath, "utf-8");
        if (parsedFilename.type === "input") {
            testcase["input"][parsedFilename.number - 1] = file;
        }
        if (parsedFilename.type === "output") {
            testcase.output[parsedFilename.number - 1] = file;
        }
    });
    return testcase;
});
exports.downloadTestcase = downloadTestcase;
//Create new file in codeFiles directory from submitted code
const saveCodeToFile = (submissionId, code, language) => {
    //Use submissionId to generate unique filename
    const filename = `${submissionId}.${language}`;
    const filePath = path_1.default.join("codeFiles", filename);
    fs_1.default.writeFileSync(filePath, code, { encoding: "utf-8" });
    return filename;
};
exports.saveCodeToFile = saveCodeToFile;
const updateSubmissionVerdict = (submissionId, verdict, stderr) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = yield client_1.default.submission.update({
        where: {
            submissionId: submissionId,
        },
        data: {
            verdict: verdict,
            stderr: stderr,
        },
    });
    return submission;
});
exports.updateSubmissionVerdict = updateSubmissionVerdict;
const createResult = (submissionId, testcaseIndex, output, verdict, time, memory) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.result.create({
        data: {
            submissionId: submissionId,
            testcaseIndex: testcaseIndex,
            output: output,
            verdict: verdict,
            time: time,
            memory: memory,
        },
    });
});
exports.createResult = createResult;
const updateUserProblemStatus = (userId, problemId) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.userProblemStatus.upsert({
        where: {
            userId_problemId: {
                userId: userId,
                problemId: problemId,
            },
        },
        update: {}, // Leave empty if you don't want to update existing records
        create: {
            userId: userId,
            problemId: problemId,
        },
    });
});
exports.updateUserProblemStatus = updateUserProblemStatus;
