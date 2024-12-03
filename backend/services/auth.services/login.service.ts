import prisma from "../../prisma/client";
import { STATUS_CODE } from "../../utils/constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginInterface } from "../../interfaces/api-interface";
import { CustomError } from "../../utils/error";

//If the request body is valid, the function will return the user object
export const validateLoginBody = async (data: LoginInterface) => {
  const { usernameOrEmail, password } = data;
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
    throw new CustomError(
      "NOT_FOUND",
      "Your email or username is invalid",
      STATUS_CODE.NOT_FOUND,
      {},
    );
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new CustomError(
      "INVALID_PASSWORD",
      "Invalid password",
      STATUS_CODE.BAD_REQUEST,
      {},
    );
  }

  return user;
};

export const signToken = async (userId: number) => {
  const token = jwt.sign(
    { userId: userId }, // Payload
    process.env.JWT_SECRET as string, // Secret
    { expiresIn: "12m" }, // Token expiration
  );
  return token;
};
