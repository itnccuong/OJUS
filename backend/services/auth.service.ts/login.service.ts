import prisma from "../../prisma/client";
import { formatResponse } from "../../utils/formatResponse";
import { STATUS_CODE } from "../../utils/constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginInterface } from "../../interfaces/api-interface";
import { CustomError } from "../../utils/error";

export const loginUser = async (user: LoginInterface) => {
  const { usernameOrEmail, password } = user;
  const foundUser = await prisma.user.findFirst({
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

  if (!foundUser) {
    throw new CustomError(
      "NOT_FOUND",
      "Your email or username is invalid",
      STATUS_CODE.NOT_FOUND,
      {},
    );
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordValid) {
    throw new CustomError(
      "INVALID_PASSWORD",
      "Invalid password",
      STATUS_CODE.BAD_REQUEST,
      {},
    );
  }

  // Generate token
  const token = jwt.sign(
    { userId: foundUser.userId }, // Payload
    process.env.JWT_SECRET as string, // Secret
    { expiresIn: "3d" }, // Token expiration
  );
  return token;
};
