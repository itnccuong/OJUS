import prisma from "../../prisma/client";
import { CustomError } from "../../utils/errorClass";
import { STATUS_CODE } from "../../utils/constants";
import bcrypt from "bcryptjs";
import { validateRegistrationData } from "./validation.service";

export const validateRegisterBody = async (data: {
  email: string;
  username: string;
  password: string;
  fullname: string;
}) => {
  // First validate the data format
  validateRegistrationData(data);

  // Then check for existing user
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new CustomError(
      existingUser.email === data.email
        ? "Email already exists!"
        : "Username already exists!",
      STATUS_CODE.CONFLICT,
    );
  }
};

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const createUser = async (
  email: string,
  fullname: string,
  hashedPassword: string,
  username: string,
) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      fullname: fullname,
      password: hashedPassword,
      username: username,
    },
  });
  return user;
};