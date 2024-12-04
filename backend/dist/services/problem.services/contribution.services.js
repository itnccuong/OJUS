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
exports.findAllPendingContributions = exports.findPendingContribution = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const error_1 = require("../../utils/error");
const constants_1 = require("../../utils/constants");
const findPendingContribution = (contributionId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield client_1.default.problem.findUnique({
        where: {
            problemId: contributionId,
            status: 0,
        },
    });
    if (!res) {
        throw new error_1.CustomError("ERROR", "Cannot find pending contribution", constants_1.STATUS_CODE.NOT_FOUND, { contributionId: contributionId });
    }
    return res;
});
exports.findPendingContribution = findPendingContribution;
const findAllPendingContributions = () => __awaiter(void 0, void 0, void 0, function* () {
    const contributions = yield client_1.default.problem.findMany({
        where: {
            status: 0,
        },
    });
    return contributions;
});
exports.findAllPendingContributions = findAllPendingContributions;
