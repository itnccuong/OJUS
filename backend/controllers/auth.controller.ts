import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import { Response as ExResponse } from "express";
import { formatResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";
import {
  ChangePasswordConfig,
  CustomRequest,
  LoginInterface,
  LoginResponse,
  RegisterConfig,
  RegisterResponse,
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

import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  Response,
  Tags,
  TsoaResponse,
  Res,
} from "tsoa";
import { CustomError } from "../utils/error";

dotenv.config();

@Route("/api/auth") // Base path for authentication-related routes
@Tags("Authentication") // Group this endpoint under "Authentication" in Swagger
export class AuthController extends Controller {
  @SuccessResponse("200", "Login successfully")
  @Post("login")
  public async login(
    @Body() requestBody: LoginInterface,
  ): Promise<SuccessResponseInterface<LoginResponse>> {
    const user = await validateLoginBody(requestBody);

    // Generate a token
    const token = await signToken(user.userId);
    return {
      message: "Login successfully",
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
  ): Promise<SuccessResponseInterface<RegisterResponse>> {
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
}

const sendResetLink = async (
  req: CustomRequest<SendResetLinkConfig, any>,
  res: Response,
) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      return formatResponse(
        res,
        "INVALID_EMAIL",
        "Invalid email",
        STATUS_CODE.BAD_REQUEST,
        {},
      );
    }

    // Create a JWT reset token
    const resetToken = jwt.sign(
      { email: user.email }, // Payload: email to identify the user
      process.env.JWT_RESET as string, // Secret key for signing the token
      { expiresIn: "1h" }, // Token expiration time (1 hour)
    );

    // Construct the reset link
    const resetLink = `${process.env.CLIENT_URL}/accounts/password/reset/key/${resetToken}`;

    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
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
    await transporter.sendMail(mailOptions);

    return formatResponse(
      res,
      "RESET_LINK_SENT",
      "Password reset link sent to your email",
      STATUS_CODE.SUCCESS,
      {},
    );
  } catch (err: any) {
    return formatResponse(
      res,
      "INTERNAL_SERVER_ERROR",
      err.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      {},
    );
  }
};

const changePassword = async (
  req: CustomRequest<ChangePasswordConfig, any>,
  res: Response,
) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the JWT token
    const decodedToken: any = jwt.verify(
      token,
      process.env.JWT_RESET as string,
    );

    if (!decodedToken || !decodedToken.email) {
      return formatResponse(
        res,
        "INVALID_TOKEN",
        "Invalid token",
        STATUS_CODE.BAD_REQUEST,
        {},
      );
    }

    // Check if user with the decoded email exists
    const user = await prisma.user.findFirst({
      where: { email: decodedToken.email },
    });

    if (!user) {
      return formatResponse(
        res,
        "USER_NOT_FOUND",
        "User not found",
        STATUS_CODE.BAD_REQUEST,
        {},
      );
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    await prisma.user.update({
      where: { email: decodedToken.email },
      data: { password: hashedPassword },
    });
    return formatResponse(
      res,
      "SUCCESS",
      "Password changed successfully",
      STATUS_CODE.SUCCESS,
      {},
    );
  } catch (err: any) {
    return formatResponse(
      res,
      "INTERNAL_SERVER_ERROR",
      err.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      {},
    );
  }
};
