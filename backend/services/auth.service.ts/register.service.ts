import { RegisterConfig } from "../../interfaces/api-interface";
import prisma from "../../prisma/client";
import { CustomError } from "../../utils/error";
import { STATUS_CODE } from "../../utils/constants";
import bcrypt from "bcrypt";

export const registerUser = async (user: RegisterConfig) => {
  const { email, fullname, password, username } = user;
  if (!email || !fullname || !password || !username) {
    throw new CustomError(
      "VALIDATION_ERROR",
      "Please fill all fields!",
      STATUS_CODE.BAD_REQUEST,
      {},
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: username }],
    },
  });

  if (existingUser) {
    throw new CustomError(
      "DUPLICATE_KEY_ERROR",
      existingUser.email === email
        ? "Email already exists!"
        : "Username already exists!",
      STATUS_CODE.CONFLICT,
      {},
    );
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const res = await prisma.user.create({
    data: {
      email: email,
      fullname: fullname,
      password: hashedPassword,
      username: username,
    },
  });
  return res;
};
