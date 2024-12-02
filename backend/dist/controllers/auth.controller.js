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
exports.changePassword = exports.sendResetLink = exports.register = exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const formatResponse_1 = require("../utils/formatResponse");
const constants_1 = require("../utils/constants");
const client_1 = __importDefault(require("../prisma/client"));
const register_service_1 = require("../services/auth.services/register.service");
const login_service_1 = require("../services/auth.services/login.service");
const tsoa_1 = require("tsoa");
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullname, password, username } = req.body;
    yield (0, register_service_1.validateRegisterBody)(req.body);
    const hashedPassword = (0, register_service_1.hashPassword)(password);
    const user = yield (0, register_service_1.createUser)(email, fullname, hashedPassword, username);
    return (0, formatResponse_1.formatResponse)(res, "USER_CREATED", "Register successfully", constants_1.STATUS_CODE.CREATED, { user });
});
exports.register = register;
let AuthController = class AuthController extends tsoa_1.Controller {
    login(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, login_service_1.validateLoginBody)(requestBody);
            // Generate a token
            const token = yield (0, login_service_1.signToken)(user.userId);
            return {
                data: {
                    user: user,
                    token: token,
                },
            };
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)("login"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)("api/auth") // Base path for authentication-related routes
    ,
    (0, tsoa_1.Tags)("Authentication") // Group this endpoint under "Authentication" in Swagger
], AuthController);
// const login = async (
//   req: CustomRequest<LoginInterface, any>,
//   res: Response,
// ) => {
//   const user = await validateLoginBody(req.body);
//   const token = await signToken(user.userId);
//
//   return formatResponse(
//     res,
//     "USER_LOGINED",
//     "Login successfully",
//     STATUS_CODE.SUCCESS,
//     { user: user, token: token },
//   );
// };
const sendResetLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // Check if the user exists
        const user = yield client_1.default.user.findFirst({
            where: { email: email },
        });
        if (!user) {
            return (0, formatResponse_1.formatResponse)(res, "INVALID_EMAIL", "Invalid email", constants_1.STATUS_CODE.BAD_REQUEST, {});
        }
        // Create a JWT reset token
        const resetToken = jsonwebtoken_1.default.sign({ email: user.email }, // Payload: email to identify the user
        process.env.JWT_RESET, // Secret key for signing the token
        { expiresIn: "1h" });
        // Construct the reset link
        const resetLink = `${process.env.CLIENT_URL}/accounts/password/reset/key/${resetToken}`;
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
        return (0, formatResponse_1.formatResponse)(res, "RESET_LINK_SENT", "Password reset link sent to your email", constants_1.STATUS_CODE.SUCCESS, {});
    }
    catch (err) {
        return (0, formatResponse_1.formatResponse)(res, "INTERNAL_SERVER_ERROR", err.message, constants_1.STATUS_CODE.INTERNAL_SERVER_ERROR, {});
    }
});
exports.sendResetLink = sendResetLink;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        // Verify the JWT token
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_RESET);
        if (!decodedToken || !decodedToken.email) {
            return (0, formatResponse_1.formatResponse)(res, "INVALID_TOKEN", "Invalid token", constants_1.STATUS_CODE.BAD_REQUEST, {});
        }
        // Check if user with the decoded email exists
        const user = yield client_1.default.user.findFirst({
            where: { email: decodedToken.email },
        });
        if (!user) {
            return (0, formatResponse_1.formatResponse)(res, "USER_NOT_FOUND", "User not found", constants_1.STATUS_CODE.BAD_REQUEST, {});
        }
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
        // Update the user's password
        yield client_1.default.user.update({
            where: { email: decodedToken.email },
            data: { password: hashedPassword },
        });
        return (0, formatResponse_1.formatResponse)(res, "SUCCESS", "Password changed successfully", constants_1.STATUS_CODE.SUCCESS, {});
    }
    catch (err) {
        return (0, formatResponse_1.formatResponse)(res, "INTERNAL_SERVER_ERROR", err.message, constants_1.STATUS_CODE.INTERNAL_SERVER_ERROR, {});
    }
});
exports.changePassword = changePassword;
