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
exports.getProfileByName = void 0;
const client_1 = require("@prisma/client");
const formatResponse_1 = require("../utils/formatResponse");
const constants_1 = require("../utils/constants");
const prisma = new client_1.PrismaClient();
const getProfileByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const user = yield prisma.user.findFirst({
        where: {
            username: username,
        },
    });
    if (!user) {
        return (0, formatResponse_1.formatResponse)(res, "USERNAME_NOT_EXISTS", "Username not exists!", constants_1.STATUS_CODE.BAD_REQUEST, {});
    }
    return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Get profile successfully!", constants_1.STATUS_CODE.SUCCESS, { user: user });
});
exports.getProfileByName = getProfileByName;
