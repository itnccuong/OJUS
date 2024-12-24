import prisma from "../../prisma/client";
import { STATUS_CODE } from "../../utils/constants";
import { CustomError } from "../../utils/errorClass";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const fineUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new CustomError("Cannot find user by email", STATUS_CODE.NOT_FOUND);
  }
  return user;
};

export const sendEmail = async (email: string, resetLink: string) => {
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
};

export const decodeResetToken = (token: string) => {
  const decodedToken = jwt.verify(token, process.env.JWT_RESET as string) as {
    email: string;
  };

  if (!decodedToken || !decodedToken.email) {
    throw new CustomError("Invalid token", STATUS_CODE.BAD_REQUEST);
  }
  return decodedToken;
};
