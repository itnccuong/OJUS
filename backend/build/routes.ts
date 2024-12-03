/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SubmissionController } from './../controllers/problem.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/auth.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "SubmissionConfig": {
        "dataType": "refObject",
        "properties": {
            "submissionId": {"dataType":"double","required":true},
            "problemId": {"dataType":"double","required":true},
            "userId": {"dataType":"double","required":true},
            "code": {"dataType":"string","required":true},
            "language": {"dataType":"string","required":true},
            "verdict": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResultConfig": {
        "dataType": "refObject",
        "properties": {
            "submissionId": {"dataType":"double","required":true},
            "verdict": {"dataType":"string","required":true},
            "resultId": {"dataType":"double","required":true},
            "output": {"dataType":"string","required":true},
            "testcaseIndex": {"dataType":"double","required":true},
            "time": {"dataType":"double","required":true},
            "memory": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TestcaseInterface": {
        "dataType": "refObject",
        "properties": {
            "input": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "output": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubmitCodeResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "submission": {"ref":"SubmissionConfig","required":true},
            "results": {"dataType":"array","array":{"dataType":"refObject","ref":"ResultConfig"},"required":true},
            "testcases": {"ref":"TestcaseInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_SubmitCodeResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"SubmitCodeResponseInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubmitCodeConfig": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"string","required":true},
            "language": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CompileErrorResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "stderr": {"dataType":"string","required":true},
            "submission": {"ref":"SubmissionConfig","required":true},
            "testcases": {"ref":"TestcaseInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponseInterface_CompileErrorResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"CompileErrorResponseInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FailTestResponseInterface": {
        "dataType": "refObject",
        "properties": {
            "stderr": {"dataType":"string","required":true},
            "submission": {"ref":"SubmissionConfig","required":true},
            "results": {"dataType":"array","array":{"dataType":"refObject","ref":"ResultConfig"},"required":true},
            "testcases": {"ref":"TestcaseInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponseInterface_FailTestResponseInterface_": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"FailTestResponseInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProblemWithUserStatusInterface": {
        "dataType": "refObject",
        "properties": {
            "problemId": {"dataType":"double","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "status": {"dataType":"double","required":true},
            "difficulty": {"dataType":"double","required":true},
            "tags": {"dataType":"string","required":true},
            "timeLimit": {"dataType":"double","required":true},
            "memoryLimit": {"dataType":"double","required":true},
            "authorId": {"dataType":"double","required":true},
            "fileId": {"dataType":"double","required":true},
            "userStatus": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetAllProblemInterface": {
        "dataType": "refObject",
        "properties": {
            "problems": {"dataType":"array","array":{"dataType":"refObject","ref":"ProblemWithUserStatusInterface"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_GetAllProblemInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"GetAllProblemInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetOneProblemInterface": {
        "dataType": "refObject",
        "properties": {
            "problem": {"ref":"ProblemWithUserStatusInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseInterface_GetOneProblemInterface_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"GetOneProblemInterface","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserConfig": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"double","required":true},
            "username": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "fullname": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"string","required":true},"user":{"ref":"UserConfig","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginInterface": {
        "dataType": "refObject",
        "properties": {
            "usernameOrEmail": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "heheInterface": {
        "dataType": "refObject",
        "properties": {
            "reason": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.post('/api/problems/:problem_id',
            ...(fetchMiddlewares<RequestHandler>(SubmissionController)),
            ...(fetchMiddlewares<RequestHandler>(SubmissionController.prototype.submit)),

            async function SubmissionController_submit(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    problem_id: {"in":"path","name":"problem_id","required":true,"dataType":"double"},
                    body: {"in":"body","name":"body","required":true,"ref":"SubmitCodeConfig"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    CompileErrorResponse: {"in":"res","name":"400","required":true,"ref":"ErrorResponseInterface_CompileErrorResponseInterface_"},
                    FailTestResponse: {"in":"res","name":"422","required":true,"ref":"ErrorResponseInterface_FailTestResponseInterface_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SubmissionController();

              await templateService.apiHandler({
                methodName: 'submit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/problems/no-account',
            ...(fetchMiddlewares<RequestHandler>(SubmissionController)),
            ...(fetchMiddlewares<RequestHandler>(SubmissionController.prototype.getAllProblemsNoAccount)),

            async function SubmissionController_getAllProblemsNoAccount(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SubmissionController();

              await templateService.apiHandler({
                methodName: 'getAllProblemsNoAccount',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/problems/with-account',
            ...(fetchMiddlewares<RequestHandler>(SubmissionController)),
            ...(fetchMiddlewares<RequestHandler>(SubmissionController.prototype.getAllProblemsWithAccount)),

            async function SubmissionController_getAllProblemsWithAccount(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SubmissionController();

              await templateService.apiHandler({
                methodName: 'getAllProblemsWithAccount',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/problems/no-account/:problem_id',
            ...(fetchMiddlewares<RequestHandler>(SubmissionController)),
            ...(fetchMiddlewares<RequestHandler>(SubmissionController.prototype.getOneProblemNoAccount)),

            async function SubmissionController_getOneProblemNoAccount(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    problem_id: {"in":"path","name":"problem_id","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SubmissionController();

              await templateService.apiHandler({
                methodName: 'getOneProblemNoAccount',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/problems/with-account/:problem_id',
            ...(fetchMiddlewares<RequestHandler>(SubmissionController)),
            ...(fetchMiddlewares<RequestHandler>(SubmissionController.prototype.getOneProblemWithAccount)),

            async function SubmissionController_getOneProblemWithAccount(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    problem_id: {"in":"path","name":"problem_id","required":true,"dataType":"double"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SubmissionController();

              await templateService.apiHandler({
                methodName: 'getOneProblemWithAccount',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginInterface"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"ref":"heheInterface"},
                    heheResponse: {"in":"res","name":"405","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"hehe":{"dataType":"double","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 202,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
