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
exports.getUserStatus = exports.queryProblemStatus = exports.queryProblems = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const queryProblems = () => __awaiter(void 0, void 0, void 0, function* () {
    const problems = yield client_1.default.problem.findMany({
        where: {
            status: 2,
        },
    });
    const res = problems.map((problem) => (Object.assign(Object.assign({}, problem), { userStatus: false })));
    return res;
});
exports.queryProblems = queryProblems;
const queryProblemStatus = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const problems = yield client_1.default.problem.findMany({
        where: {
            status: 2,
        },
    });
    const problemsWithStatus = yield Promise.all(problems.map((problem) => __awaiter(void 0, void 0, void 0, function* () {
        const userProblemStatus = yield client_1.default.userProblemStatus.findFirst({
            where: {
                userId: userId,
                problemId: problem.problemId,
            },
        });
        return Object.assign(Object.assign({}, problem), { userStatus: userProblemStatus ? true : false });
    })));
    return problemsWithStatus;
});
exports.queryProblemStatus = queryProblemStatus;
const getUserStatus = (userId, problemId) => __awaiter(void 0, void 0, void 0, function* () {
    const userProblemStatus = yield client_1.default.userProblemStatus.findFirst({
        where: {
            userId: userId,
            problemId: problemId,
        },
    });
    return {
        userStatus: !!userProblemStatus,
    };
});
exports.getUserStatus = getUserStatus;
