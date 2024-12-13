"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.ProblemController = void 0;
const executor_utils_1 = require("../services/problem.services/code-executor/executor-utils");
const submit_services_1 = require("../services/problem.services/submit.services");
const problem_service_1 = require("../services/problem.services/problem.service");
const tsoa_1 = require("tsoa");
const verify_token_1 = require("../middlewares/verify-token");
const client_1 = __importDefault(require("../prisma/client"));
let ProblemController = class ProblemController extends tsoa_1.Controller {
    submit(problem_id, body, req, CompileErrorResponse, FailTestResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, language } = body;
            const userId = req.userId;
            // Step 1: Create submission record
            let submission = yield (0, submit_services_1.createSubmission)(problem_id, userId, code, language);
            const problem = yield (0, submit_services_1.findProblemById)(problem_id);
            const file = yield (0, submit_services_1.findFileById)(problem.fileId);
            const fileUrl = file.location;
            // Step 2: Get test cases
            const testcases = yield (0, submit_services_1.downloadTestcase)(fileUrl);
            // Step 3: Save code to a file
            let filename = (0, submit_services_1.saveCodeToFile)(submission.submissionId, code, language);
            // Step 4: Compile code
            const compileResult = yield (0, executor_utils_1.compile)(filename, language);
            if (compileResult.stderr) {
                submission = yield (0, submit_services_1.updateSubmissionVerdict)(submission.submissionId, "COMPILE_ERROR", compileResult.stderr);
                return CompileErrorResponse(400, {
                    message: "Compile error",
                    name: "COMPILE_ERROR",
                    data: {
                        stderr: compileResult.stderr,
                        submission: submission,
                        testcases: testcases,
                    },
                });
            }
            // Step 5: Run test cases
            filename = compileResult.filenameWithoutExtension;
            const testcaseLength = testcases.input.length;
            const timeLimit = problem.timeLimit;
            for (let index = 0; index < testcaseLength; ++index) {
                const result = yield (0, executor_utils_1.executeAgainstTestcase)(filename, testcases.input[index], testcases.output[index], language, timeLimit);
                yield (0, submit_services_1.createResult)(submission.submissionId, index, result.stdout, result.verdict, 0, 0);
                if (result.verdict !== "OK") {
                    submission = yield (0, submit_services_1.updateSubmissionVerdict)(submission.submissionId, result.verdict, result.stderr);
                    //Query all result
                    const results = yield client_1.default.result.findMany({
                        where: {
                            submissionId: submission.submissionId,
                        },
                    });
                    return FailTestResponse(422, {
                        message: result.verdict,
                        name: result.verdict,
                        data: {
                            stderr: result.stderr,
                            submission: submission,
                            results: results,
                            testcases: testcases,
                        },
                    });
                }
            }
            // Step 6: Update final verdict
            submission = yield (0, submit_services_1.updateSubmissionVerdict)(submission.submissionId, "OK", "");
            yield (0, submit_services_1.updateUserProblemStatus)(userId, problem_id);
            const results = yield client_1.default.result.findMany({
                where: {
                    submissionId: submission.submissionId,
                },
            });
            return {
                message: "All testcases passed",
                data: { submission: submission, results: results, testcases: testcases },
            };
        });
    }
    getAllProblemsNoAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const problems = yield (0, problem_service_1.queryProblems)();
            return {
                message: "Get all problems successfully",
                data: { problems },
            };
        });
    }
    getAllProblemsWithAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const responseData = yield (0, problem_service_1.queryProblemStatus)(userId);
            return {
                message: "Get all problems with account successfully",
                data: { problems: responseData },
            };
        });
    }
    /**
     * Fetch a single problem without user account data.
     */
    getOneProblemNoAccount(problem_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const problem = yield (0, submit_services_1.findProblemById)(problem_id);
            const resProblem = Object.assign(Object.assign({}, problem), { userStatus: false });
            return {
                message: "Problem fetched successfully!",
                data: { problem: resProblem },
            };
        });
    }
    /**
     * Fetch a single problem with user account data (status included).
     */
    getOneProblemWithAccount(problem_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const problem = yield (0, submit_services_1.findProblemById)(problem_id);
            const userStatus = yield (0, problem_service_1.getUserStatus)(userId, problem.problemId);
            const resProblem = Object.assign(Object.assign({}, problem), { userStatus: userStatus.userStatus });
            return {
                message: "Problem fetched successfully!",
                data: { problem: resProblem },
            };
        });
    }
    getSubmissionsFromProblem(problem_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const submissions = yield (0, problem_service_1.findSubmissionsProblem)(problem_id, userId);
            return {
                message: "Submissions fetched successfully!",
                data: { submissions: submissions },
            };
        });
    }
};
exports.ProblemController = ProblemController;
__decorate([
    (0, tsoa_1.Post)("{problem_id}/"),
    (0, tsoa_1.Middlewares)(verify_token_1.verifyToken),
    (0, tsoa_1.SuccessResponse)(200, "All testcases passed"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __param(3, (0, tsoa_1.Res)()),
    __param(4, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Function, Function]),
    __metadata("design:returntype", Promise)
], ProblemController.prototype, "submit", null);
__decorate([
    (0, tsoa_1.Get)("/no-account"),
    (0, tsoa_1.SuccessResponse)(200, "Successfully fetched all problems"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProblemController.prototype, "getAllProblemsNoAccount", null);
__decorate([
    (0, tsoa_1.Get)("/with-account")
    // @Security("jwt")
    ,
    (0, tsoa_1.Middlewares)(verify_token_1.verifyToken),
    (0, tsoa_1.SuccessResponse)(200, "Successfully fetched all problems with account"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProblemController.prototype, "getAllProblemsWithAccount", null);
__decorate([
    (0, tsoa_1.Get)("/no-account/{problem_id}"),
    (0, tsoa_1.SuccessResponse)(200, "Successfully fetched problem without user data"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProblemController.prototype, "getOneProblemNoAccount", null);
__decorate([
    (0, tsoa_1.Get)("/with-account/{problem_id}"),
    (0, tsoa_1.Middlewares)(verify_token_1.verifyToken),
    (0, tsoa_1.SuccessResponse)(200, "Successfully fetched problem with user data"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProblemController.prototype, "getOneProblemWithAccount", null);
__decorate([
    (0, tsoa_1.Get)("/{problem_id}/submissions"),
    (0, tsoa_1.Middlewares)(verify_token_1.verifyToken),
    (0, tsoa_1.SuccessResponse)(200, "Successfully fetched submissions from problem"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProblemController.prototype, "getSubmissionsFromProblem", null);
exports.ProblemController = ProblemController = __decorate([
    (0, tsoa_1.Route)("/api/problems") // Base path for submission-related routes
    ,
    (0, tsoa_1.Tags)("Problems") // Group this endpoint under "Submission" in Swagger
], ProblemController);
