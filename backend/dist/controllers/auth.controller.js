"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const register_service_1 = require("../services/auth.services/register.service");
const login_service_1 = require("../services/auth.services/login.service");
const tsoa_1 = require("tsoa");
const auth_services_1 = require("../services/problem.services/auth.services");
dotenv_1.default.config();
let AuthController = class AuthController extends tsoa_1.Controller {
  login(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield (0, login_service_1.validateLoginBody)(requestBody);
      // Generate a token
      const token = yield (0, login_service_1.signToken)(user.userId);
      return {
        message: "Login successfully!",
        data: {
          user: user,
          token: token,
        },
      };
    });
  }
  register(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
      const { email, fullname, password, username } = requestBody;
      // Validate the registration request
      yield (0, register_service_1.validateRegisterBody)(requestBody);
      // Hash the password
      const hashedPassword = (0, register_service_1.hashPassword)(password);
      // Create a new user in the database
      const user = yield (0, register_service_1.createUser)(
        email,
        fullname,
        hashedPassword,
        username,
      );
      return {
        message: "Register successfully",
        data: { user: user },
      };
    });
  }
  sendResetLink(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
      const { email } = requestBody;
      // Check if the user exists
      const user = yield (0, auth_services_1.fineUserByEmail)(email);
      if (!user) {
        throw new Error("User not found");
      }
      // Create a JWT reset token
      const resetToken = jsonwebtoken_1.default.sign(
        { email: user.email }, // Payload: email to identify the user
        process.env.JWT_RESET, // Secret key for signing the token
        { expiresIn: "1h" },
      );
      // Construct the reset link
      const resetLink = `${process.env.CLIENT_URL}/accounts/password/reset/key/${resetToken}`;
      // Send the reset link via email
      yield (0, auth_services_1.sendEmail)(email, resetLink);
      // Respond with a success message
      return {
        message: "Password reset link sent to your email",
        data: {},
      };
    });
  }
  changePassword(requestBody) {
    return __awaiter(this, void 0, void 0, function* () {
      const { token, newPassword } = requestBody;
      // Verify the JWT token
      const decodedToken = (0, auth_services_1.decodeResetToken)(token);
      const email = decodedToken.email;
      // Check if the user exists
      const user = yield (0, auth_services_1.fineUserByEmail)(email);
      if (!user) {
        throw new Error("User not found");
      }
      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = yield bcrypt_1.default.hash(
        newPassword,
        saltRounds,
      );
      // Update the user's password
      yield client_1.default.user.update({
        where: { email: email },
        data: { password: hashedPassword },
      });
      // Respond with a success message
      return {
        message: "Password changed successfully",
        data: {},
      };
    });
  }
};
exports.AuthController = AuthController;
__decorate(
  [
    (0, tsoa_1.SuccessResponse)("200", "Login successfully"),
    (0, tsoa_1.Post)("login"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "login",
  null,
);
__decorate(
  [
    (0, tsoa_1.Post)("register"),
    (0, tsoa_1.SuccessResponse)("201", "User registered successfully"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "register",
  null,
);
__decorate(
  [
    (0, tsoa_1.Post)("password/reset-link"),
    (0, tsoa_1.SuccessResponse)("200", "Password reset link sent successfully"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "sendResetLink",
  null,
);
__decorate(
  [
    (0, tsoa_1.Post)("password/change"),
    (0, tsoa_1.SuccessResponse)("200", "Password changed successfully"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  AuthController.prototype,
  "changePassword",
  null,
);
exports.AuthController = AuthController = __decorate(
  [
    (0, tsoa_1.Route)("/src/auth"), // Base path for authentication-related routes
    (0, tsoa_1.Tags)("Authentication"), // Group this endpoint under "Authentication" in Swagger
  ],
  AuthController,
);
