import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import nodemailer from "nodemailer";

import { formatResponse, successResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";
import { downloadTestcase } from "../services/problem.services";
import { LoginRequest } from "../interfaces";

const prisma = new PrismaClient();

const register = async (req: Request, res: Response) => {
  try {
    const { email, fullname, password, username } = req.body;

    if (!email || !fullname || !password || !username) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Please fill all fields!",
      );
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "A user is already registered with this e-mail address.",
      );
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (existingUsername) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Username cannot be used. Please choose another username.",
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        fullname: fullname,
        password: hashedPassword,
      },
    });

    return formatResponse(
      res,
      { user },
      STATUS_CODE.SUCCESS,
      "Create account successfully!",
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      err.message,
    );
  }
};

const login = async (req: LoginRequest, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await prisma.user.findFirst({
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
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Invalid email or username",
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Invalid password",
      );
    }

    // Generate token
    const token = jwt.sign(
      user,
      process.env.JWT_SECRET as string, // Secret
      { expiresIn: "3d" }, // Token expiration
    );

    // return formatResponse(
    //   res,
    //   {
    //     token: token,
    //     // user: {
    //     //   id: user.userId,
    //     //   email: user.email,
    //     //   username: user.username,
    //     // },
    //   },
    //   STATUS_CODE.SUCCESS,
    //   "Login successfully!",
    // );
    return successResponse(res, { token: token });
  } catch (err: any) {
    console.log(err);
    return formatResponse(
      res,
      {},
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      err.message,
    );
  }
};

const sendResetLink = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      return formatResponse(res, {}, STATUS_CODE.BAD_REQUEST, "Invalid email");
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
      from: '"Vua Leetcode" <no-reply@vualeetcode.com>', // Sender address
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
      {},
      STATUS_CODE.SUCCESS,
      "Password reset link sent to your email",
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      err.message,
    );
  }
};

const changePassword = async (req: Request, res: Response) => {
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
        {},
        STATUS_CODE.UNAUTHORIZED,
        "Invalid or expired token",
      );
    }

    // Check if user with the decoded email exists
    const user = await prisma.user.findFirst({
      where: { email: decodedToken.email },
    });

    if (!user) {
      return formatResponse(res, {}, STATUS_CODE.BAD_REQUEST, "User not found");
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
      {},
      STATUS_CODE.SUCCESS,
      "Password changed successfully",
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      err.message,
    );
  }
};

export { register, login, sendResetLink, changePassword };
