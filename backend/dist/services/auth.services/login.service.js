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
exports.signToken = exports.validateLoginBody = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const constants_1 = require("../../utils/constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../../utils/error");
//If the request body is valid, the function will return the user object
const validateLoginBody = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { usernameOrEmail, password } = data;
    const user = yield client_1.default.user.findFirst({
        where: {
            OR: [
                {
                    username: usernameOrEmail,
                },
                {
                    email: usernameOrEmail,
                },
            ],
        },
    });
    if (!user) {
        throw new error_1.CustomError("NOT_FOUND", "Your email or username is invalid", constants_1.STATUS_CODE.NOT_FOUND, {});
    }
    // Verify password
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new error_1.CustomError("INVALID_PASSWORD", "Invalid password", constants_1.STATUS_CODE.BAD_REQUEST, {});
    }
    return user;
});
exports.validateLoginBody = validateLoginBody;
const signToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ userId: userId }, // Payload
    process.env.JWT_SECRET, // Secret
    { expiresIn: "12m" });
    return token;
});
exports.signToken = signToken;
