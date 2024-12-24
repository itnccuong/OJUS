import prisma from "../../prisma/client";
import { CustomError } from "../../utils/errorClass";
import { STATUS_CODE } from "../../utils/constants";
import bcrypt from "bcryptjs";

export const validateRegisterBody = async (data: {
  email: string;
  username: string;
  password: string;
  fullname: string;
}) => {
  const { email, fullname, password, username } = data;
  if (!email || !fullname || !password || !username) {
    throw new CustomError("Please fill all fields!", STATUS_CODE.BAD_REQUEST);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: username }],
    },
  });

  if (existingUser) {
    throw new CustomError(
      existingUser.email === email
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
