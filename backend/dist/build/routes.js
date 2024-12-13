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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const submission_controller_1 = require("./../controllers/submission.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const problem_controller_1 = require("./../controllers/problem.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const contribute_controller_1 = require("./../controllers/contribute.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const auth_controller_1 = require("./../controllers/auth.controller");
const multer = require('multer');
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "DefaultSelection_Prisma._36_SubmissionPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "stderr": { "dataType": "string", "required": true }, "createdAt": { "dataType": "datetime", "required": true }, "verdict": { "dataType": "string", "required": true }, "language": { "dataType": "string", "required": true }, "code": { "dataType": "string", "required": true }, "userId": { "dataType": "double", "required": true }, "problemId": { "dataType": "double", "required": true }, "submissionId": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Submission": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection_Prisma._36_SubmissionPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_ResultPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "memory": { "dataType": "double", "required": true }, "time": { "dataType": "double", "required": true }, "testcaseIndex": { "dataType": "double", "required": true }, "output": { "dataType": "string", "required": true }, "resultId": { "dataType": "double", "required": true }, "createdAt": { "dataType": "datetime", "required": true }, "verdict": { "dataType": "string", "required": true }, "submissionId": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Result": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection_Prisma._36_ResultPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TestcaseInterface": {
        "dataType": "refObject",
        "properties": {
            "input": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "output": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_ProblemPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "fileId": { "dataType": "double", "required": true }, "authorId": { "dataType": "double", "required": true }, "memoryLimit": { "dataType": "double", "required": true }, "timeLimit": { "dataType": "double", "required": true }, "tags": { "dataType": "string", "required": true }, "difficulty": { "dataType": "double", "required": true }, "status": { "dataType": "double", "required": true }, "description": { "dataType": "string", "required": true }, "title": { "dataType": "string", "required": true }, "createdAt": { "dataType": "datetime", "required": true }, "problemId": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Problem": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection_Prisma._36_ProblemPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOneSubmissionInterface": {
        "dataType": "refObject",
        "properties": {
            "submission": { "ref": "Submission", "required": true },
            "results": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Result" }, "required": true },
            "testcases": { "ref": "TestcaseInterface", "required": true },
            "problem": { "ref": "Problem", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_GetOneSubmissionInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "GetOneSubmissionInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubmitCodeResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "submission": { "ref": "Submission", "required": true },
            "results": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Result" }, "required": true },
            "testcases": { "ref": "TestcaseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_SubmitCodeResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "SubmitCodeResponseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubmitCodeConfig": {
        "dataType": "refObject",
        "properties": {
            "code": { "dataType": "string", "required": true },
            "language": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CompileErrorResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "stderr": { "dataType": "string", "required": true },
            "submission": { "ref": "Submission", "required": true },
            "testcases": { "ref": "TestcaseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponseInterface_CompileErrorResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "CompileErrorResponseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FailTestResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "stderr": { "dataType": "string", "required": true },
            "submission": { "ref": "Submission", "required": true },
            "results": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Result" }, "required": true },
            "testcases": { "ref": "TestcaseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponseInterface_FailTestResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "FailTestResponseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProblemWithUserStatusInterface": {
        "dataType": "refObject",
        "properties": {
            "fileId": { "dataType": "double", "required": true },
            "authorId": { "dataType": "double", "required": true },
            "memoryLimit": { "dataType": "double", "required": true },
            "timeLimit": { "dataType": "double", "required": true },
            "tags": { "dataType": "string", "required": true },
            "difficulty": { "dataType": "double", "required": true },
            "status": { "dataType": "double", "required": true },
            "description": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "problemId": { "dataType": "double", "required": true },
            "userStatus": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllProblemInterface": {
        "dataType": "refObject",
        "properties": {
            "problems": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ProblemWithUserStatusInterface" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_GetAllProblemInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "GetAllProblemInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOneProblemInterface": {
        "dataType": "refObject",
        "properties": {
            "problem": { "ref": "ProblemWithUserStatusInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_GetOneProblemInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "GetOneProblemInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllSubmissionsInterface": {
        "dataType": "refObject",
        "properties": {
            "submissions": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Submission" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_GetAllSubmissionsInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "GetAllSubmissionsInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ContributionResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "contribution": { "ref": "Problem", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_ContributionResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "ContributionResponseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface__contributions-Problem-Array__": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "nestedObjectLiteral", "nestedProperties": { "contributions": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Problem" }, "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface__contribution-Problem__": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "nestedObjectLiteral", "nestedProperties": { "contribution": { "ref": "Problem", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection_Prisma._36_UserPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "password": { "dataType": "string", "required": true }, "fullname": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true }, "username": { "dataType": "string", "required": true }, "createdAt": { "dataType": "datetime", "required": true }, "userId": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection_Prisma._36_UserPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "user": { "ref": "User", "required": true },
            "token": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_LoginResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "LoginResponseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginInterface": {
        "dataType": "refObject",
        "properties": {
            "usernameOrEmail": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "user": { "ref": "User", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_RegisterResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "ref": "RegisterResponseInterface", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterConfig": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "fullname": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface____": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendResetLinkConfig": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChangePasswordConfig": {
        "dataType": "refObject",
        "properties": {
            "token": { "dataType": "string", "required": true },
            "newPassword": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app, opts) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const upload = (opts === null || opts === void 0 ? void 0 : opts.multer) || multer({ "limits": { "fileSize": 8388608 } });
    app.get('/api/submissions/:submission_id', ...((0, runtime_1.fetchMiddlewares)(submission_controller_1.SubmissionController)), ...((0, runtime_1.fetchMiddlewares)(submission_controller_1.SubmissionController.prototype.login)), function SubmissionController_login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                submission_id: { "in": "path", "name": "submission_id", "required": true, "dataType": "double" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new submission_controller_1.SubmissionController();
                yield templateService.apiHandler({
                    methodName: 'login',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/problems/:problem_id', ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController)), ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController.prototype.submit)), function ProblemController_submit(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                problem_id: { "in": "path", "name": "problem_id", "required": true, "dataType": "double" },
                body: { "in": "body", "name": "body", "required": true, "ref": "SubmitCodeConfig" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                CompileErrorResponse: { "in": "res", "name": "400", "required": true, "ref": "ErrorResponseInterface_CompileErrorResponseInterface_" },
                FailTestResponse: { "in": "res", "name": "422", "required": true, "ref": "ErrorResponseInterface_FailTestResponseInterface_" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new problem_controller_1.ProblemController();
                yield templateService.apiHandler({
                    methodName: 'submit',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/problems/no-account', ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController)), ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController.prototype.getAllProblemsNoAccount)), function ProblemController_getAllProblemsNoAccount(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {};
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new problem_controller_1.ProblemController();
                yield templateService.apiHandler({
                    methodName: 'getAllProblemsNoAccount',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/problems/with-account', ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController)), ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController.prototype.getAllProblemsWithAccount)), function ProblemController_getAllProblemsWithAccount(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new problem_controller_1.ProblemController();
                yield templateService.apiHandler({
                    methodName: 'getAllProblemsWithAccount',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/problems/no-account/:problem_id', ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController)), ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController.prototype.getOneProblemNoAccount)), function ProblemController_getOneProblemNoAccount(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                problem_id: { "in": "path", "name": "problem_id", "required": true, "dataType": "double" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new problem_controller_1.ProblemController();
                yield templateService.apiHandler({
                    methodName: 'getOneProblemNoAccount',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/problems/with-account/:problem_id', ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController)), ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController.prototype.getOneProblemWithAccount)), function ProblemController_getOneProblemWithAccount(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                problem_id: { "in": "path", "name": "problem_id", "required": true, "dataType": "double" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new problem_controller_1.ProblemController();
                yield templateService.apiHandler({
                    methodName: 'getOneProblemWithAccount',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/problems/:problem_id/submissions', ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController)), ...((0, runtime_1.fetchMiddlewares)(problem_controller_1.ProblemController.prototype.getSubmissionsFromProblem)), function ProblemController_getSubmissionsFromProblem(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                problem_id: { "in": "path", "name": "problem_id", "required": true, "dataType": "double" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new problem_controller_1.ProblemController();
                yield templateService.apiHandler({
                    methodName: 'getSubmissionsFromProblem',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/contributions', upload.fields([
        {
            name: "file",
            maxCount: 1
        }
    ]), ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController)), ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController.prototype.submitContribute)), function ContributionController_submitContribute(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                title: { "in": "formData", "name": "title", "required": true, "dataType": "string" },
                description: { "in": "formData", "name": "description", "required": true, "dataType": "string" },
                difficulty: { "in": "formData", "name": "difficulty", "required": true, "dataType": "string" },
                tags: { "in": "formData", "name": "tags", "required": true, "dataType": "string" },
                timeLimit: { "in": "formData", "name": "timeLimit", "required": true, "dataType": "string" },
                memoryLimit: { "in": "formData", "name": "memoryLimit", "required": true, "dataType": "string" },
                file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new contribute_controller_1.ContributionController();
                yield templateService.apiHandler({
                    methodName: 'submitContribute',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 201,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/contributions', ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController)), ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController.prototype.getAllContribute)), function ContributionController_getAllContribute(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {};
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new contribute_controller_1.ContributionController();
                yield templateService.apiHandler({
                    methodName: 'getAllContribute',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/contributions/:contribute_id', ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController)), ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController.prototype.getOneContribute)), function ContributionController_getOneContribute(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                contribute_id: { "in": "path", "name": "contribute_id", "required": true, "dataType": "double" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new contribute_controller_1.ContributionController();
                yield templateService.apiHandler({
                    methodName: 'getOneContribute',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/contributions/:contribute_id/accept', ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController)), ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController.prototype.acceptContribution)), function ContributionController_acceptContribution(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                contribute_id: { "in": "path", "name": "contribute_id", "required": true, "dataType": "double" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new contribute_controller_1.ContributionController();
                yield templateService.apiHandler({
                    methodName: 'acceptContribution',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/contributions/:contribute_id/reject', ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController)), ...((0, runtime_1.fetchMiddlewares)(contribute_controller_1.ContributionController.prototype.rejectContribution)), function ContributionController_rejectContribution(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                contribute_id: { "in": "path", "name": "contribute_id", "required": true, "dataType": "double" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new contribute_controller_1.ContributionController();
                yield templateService.apiHandler({
                    methodName: 'rejectContribution',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/auth/login', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.login)), function AuthController_login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "LoginInterface" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'login',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/auth/register', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.register)), function AuthController_register(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "RegisterConfig" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'register',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 201,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/auth/password/reset-link', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.sendResetLink)), function AuthController_sendResetLink(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "SendResetLinkConfig" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'sendResetLink',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/auth/password/change', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.changePassword)), function AuthController_changePassword(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "ChangePasswordConfig" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'changePassword',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
