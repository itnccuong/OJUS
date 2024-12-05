import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {
  ChangePasswordConfig,
  LoginInterface,
  LoginResponseInterface,
  RegisterConfig,
  RegisterResponseInterface,
  SendResetLinkConfig,
  SuccessResponseInterface,
} from "../interfaces/api-interface";
import prisma from "../prisma/client";
import {
  createUser,
  hashPassword,
  validateRegisterBody,
} from "../services/auth.services/register.service";
import {
  signToken,
  validateLoginBody,
} from "../services/auth.services/login.service";

import { Body, Controller, Post, Route, SuccessResponse, Tags } from "tsoa";
import { CustomError } from "../utils/error";
import {
  decodeResetToken,
  fineUserByEmail,
  sendEmail,
} from "../services/auth.services/password.services";

dotenv.config();

@Route("/api/auth") // Base path for authentication-related routes
@Tags("Authentication") // Group this endpoint under "Authentication" in Swagger
export class AuthController extends Controller {
  @SuccessResponse("200", "Login successfully")
  @Post("login")
  public async login(
    @Body() requestBody: LoginInterface,
  ): Promise<SuccessResponseInterface<LoginResponseInterface>> {
    const user = await validateLoginBody(requestBody);

    // Generate a token
    const token = await signToken(user.userId);
    return {
      message: "Login successfully!",
      data: {
        user: user,
        token: token,
      },
    };
  }

  @Post("register")
  @SuccessResponse("201", "User registered successfully")
  public async register(
    @Body() requestBody: RegisterConfig, // Request body containing registration details
  ): Promise<SuccessResponseInterface<RegisterResponseInterface>> {
    const { email, fullname, password, username } = requestBody;

    // Validate the registration request
    await validateRegisterBody(requestBody);

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Create a new user in the database
    const user = await createUser(email, fullname, hashedPassword, username);

    return {
      message: "Register successfully",
      data: { user: user },
    };
  }

  @Post("password/reset-link")
  @SuccessResponse("200", "Password reset link sent successfully")
  public async sendResetLink(
    @Body() requestBody: SendResetLinkConfig, // Request body containing the email
  ): Promise<SuccessResponseInterface<{}>> {
    const { email } = requestBody;

    // Check if the user exists
    const user = await fineUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    // Create a JWT reset token
    const resetToken = jwt.sign(
      { email: user.email }, // Payload: email to identify the user
      process.env.JWT_RESET as string, // Secret key for signing the token
      { expiresIn: "1h" }, // Token expiration time (1 hour)
    );

    // Construct the reset link
    const resetLink = `${process.env.CLIENT_URL}/accounts/password/reset/key/${resetToken}`;

    // Send the reset link via email
    await sendEmail(email, resetLink);

    // Respond with a success message
    return {
      message: "Password reset link sent to your email",
      data: {},
    };
  }

  @Post("password/change")
  @SuccessResponse("200", "Password changed successfully")
  public async changePassword(
    @Body() requestBody: ChangePasswordConfig, // Request body containing token and new password
  ): Promise<SuccessResponseInterface<{}>> {
    const { token, newPassword } = requestBody;

    // Verify the JWT token
    const decodedToken = decodeResetToken(token);
    const email = decodedToken.email;

    // Check if the user exists
    const user = await fineUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    // Respond with a success message
    return {
      message: "Password changed successfully",
      data: {},
    };
  }
}
