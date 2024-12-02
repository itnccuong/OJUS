"use strict";
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
exports.getOneProblemWithAccount = exports.getOneProblemNoAccount = exports.getAllProblemsWithAccount = exports.getAllProblemsNoAccount = exports.submit = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const formatResponse_1 = require("../utils/formatResponse");
const executor_utils_1 = require("../services/code-executor/executor-utils");
const submit_services_1 = require("../services/problem.services/submit.services");
const constants_1 = require("../utils/constants");
const problem_service_1 = require("../services/problem.services/problem.service");
dotenv_1.default.config();
const submit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problem_id = parseInt(req.params.problem_id);
    const userId = req.userId;
    const { code, language } = req.body;
    // const language = convertLanguage(req.body.language);
    let submission = yield (0, submit_services_1.createSubmission)(problem_id, userId, code, language);
    const problem = yield (0, submit_services_1.findProblemById)(problem_id);
    const file = yield (0, submit_services_1.findFileById)(problem.fileId);
    const fileUrl = file.location;
    const testcase = yield (0, submit_services_1.downloadTestcase)(fileUrl);
    let filename = (0, submit_services_1.saveCodeToFile)(submission.submissionId, code, language);
    const compileResult = yield (0, executor_utils_1.compile)(filename, language);
    if (compileResult.stderr) {
        submission = yield (0, submit_services_1.updateSubmissionVerdict)(submission.submissionId, "COMPILE_ERROR");
        return (0, formatResponse_1.formatResponse)(res, "COMPILE_ERROR", "Compile error", constants_1.STATUS_CODE.BAD_REQUEST, {
            submission: submission,
            stderr: compileResult.stderr,
        });
    }
    filename = compileResult.filenameWithoutExtension;
    const testcaseLength = testcase.input.length;
    const timeLimit = problem.timeLimit;
    for (let index = 0; index < testcaseLength; ++index) {
        const result = yield (0, executor_utils_1.executeAgainstTestcase)(filename, executor_utils_1.languageDetails[language].inputFunction
            ? executor_utils_1.languageDetails[language].inputFunction(testcase.input[index])
            : testcase.input[index], testcase.output[index], language, timeLimit);
        yield (0, submit_services_1.createResult)(submission.submissionId, index, result.stdout, result.verdict, 0, 0);
        if (result.verdict !== "OK") {
            submission = yield (0, submit_services_1.updateSubmissionVerdict)(submission.submissionId, result.verdict);
            return (0, formatResponse_1.formatResponse)(res, result.verdict, result.verdict, constants_1.STATUS_CODE.BAD_REQUEST, {
                submission: submission,
            });
        }
    }
    submission = yield (0, submit_services_1.updateSubmissionVerdict)(submission.submissionId, "OK");
    // const results = await prisma.result.findMany({
    //   where: {
    //     submissionId: submission.submissionId,
    //   },
    // });
    yield (0, submit_services_1.updateUserProblemStatus)(userId, problem_id);
    return (0, formatResponse_1.formatResponse)(res, "ALL_TEST_PASSED", "All testcases passed", constants_1.STATUS_CODE.SUCCESS, {
        submission: submission,
    });
});
exports.submit = submit;
const getAllProblemsNoAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problems = yield (0, problem_service_1.queryProblems)();
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Get all problems successfully", constants_1.STATUS_CODE.SUCCESS, { problems: problems });
});
exports.getAllProblemsNoAccount = getAllProblemsNoAccount;
const getAllProblemsWithAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    //Join userProblemStatus with problem to get status of each problem
    const responseData = yield (0, problem_service_1.queryProblemStatus)(userId);
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Get all problems successfully", constants_1.STATUS_CODE.SUCCESS, { problems: responseData });
});
exports.getAllProblemsWithAccount = getAllProblemsWithAccount;
const getOneProblemNoAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problem_id = parseInt(req.params.problem_id);
    const problem = yield (0, submit_services_1.findProblemById)(problem_id);
    const resProblem = Object.assign(Object.assign({}, problem), { userStatus: false });
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Problem fetch successfully!", constants_1.STATUS_CODE.SUCCESS, { problem: resProblem });
});
exports.getOneProblemNoAccount = getOneProblemNoAccount;
const getOneProblemWithAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problem_id = parseInt(req.params.problem_id);
    const userId = req.userId;
    const problem = yield (0, submit_services_1.findProblemById)(problem_id);
    const userStatus = yield (0, problem_service_1.getUserStatus)(userId, problem.problemId);
    const resProblem = Object.assign(Object.assign({}, problem), { userStatus: userStatus.userStatus });
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Problem fetch successfully!", constants_1.STATUS_CODE.SUCCESS, { problem: resProblem });
});
exports.getOneProblemWithAccount = getOneProblemWithAccount;
