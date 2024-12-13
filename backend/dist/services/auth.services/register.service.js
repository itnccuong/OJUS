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
exports.createUser = exports.hashPassword = exports.validateRegisterBody = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const error_1 = require("../../utils/error");
const constants_1 = require("../../utils/constants");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validateRegisterBody = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullname, password, username } = data;
    if (!email || !fullname || !password || !username) {
        throw new error_1.CustomError("VALIDATION_ERROR", "Please fill all fields!", constants_1.STATUS_CODE.BAD_REQUEST, {});
    }
    const existingUser = yield client_1.default.user.findFirst({
        where: {
            OR: [{ email: email }, { username: username }],
        },
    });
    if (existingUser) {
        throw new error_1.CustomError("DUPLICATE_KEY_ERROR", existingUser.email === email
            ? "Email already exists!"
            : "Username already exists!", constants_1.STATUS_CODE.CONFLICT, {});
    }
});
exports.validateRegisterBody = validateRegisterBody;
const hashPassword = (password) => {
    const salt = bcryptjs_1.default.genSaltSync(10);
    return bcryptjs_1.default.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
const createUser = (email, fullname, hashedPassword, username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.user.create({
        data: {
            email: email,
            fullname: fullname,
            password: hashedPassword,
            username: username,
        },
    });
    return user;
});
exports.createUser = createUser;
