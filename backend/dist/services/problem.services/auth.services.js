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
exports.decodeResetToken = exports.sendEmail = exports.fineUserByEmail = void 0;
const client_1 = __importDefault(require("../../prisma/client"));
const constants_1 = require("../../utils/constants");
const error_1 = require("../../utils/error");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fineUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new error_1.CustomError("ERROR", "Cannot find user by email", constants_1.STATUS_CODE.NOT_FOUND, { email: email });
    }
    return user;
});
exports.fineUserByEmail = fineUserByEmail;
const sendEmail = (email, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your password
        },
    });
    // Set up email data
    const mailOptions = {
        from: '"OJUS" <no-reply@ojus.com>', // Sender address
        to: email, // Receiver's email
        subject: "Password Reset E-mail",
        // text: `You're receiving this e-mail because you or someone else has requested a password reset for your user account at.
        // Click the link below to reset your password:
        // ${resetLink}
        // If you did not request a password reset you can safely ignore this email.`,
        html: `<p>You're receiving this e-mail because you or someone else has requested a password reset for your user account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request a password reset you can safely ignore this email.</p>`,
    };
    // Send the email
    yield transporter.sendMail(mailOptions);
});
exports.sendEmail = sendEmail;
const decodeResetToken = (token) => {
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_RESET);
    if (!decodedToken || !decodedToken.email) {
        throw new error_1.CustomError("INVALID_TOKEN", "Invalid token", constants_1.STATUS_CODE.BAD_REQUEST, {});
    }
    return decodedToken;
};
exports.decodeResetToken = decodeResetToken;
