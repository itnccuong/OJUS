import { CustomError } from "../../utils/errorClass";
import { STATUS_CODE } from "../../utils/constants";
import prisma from "../../prisma/client";

const validatePassword = (password: string): void => {
  const allowedSpecialChars = /^[A-Za-z0-9#@!*]+$/;

  if (password.length < 8) {
    throw new CustomError(
      "Password must be at least 8 characters long",
      STATUS_CODE.BAD_REQUEST
    );
  }

  if (password.length > 50) {
    throw new CustomError(
      "Password cannot exceed 50 characters",
      STATUS_CODE.BAD_REQUEST
    );
  }

  if (!allowedSpecialChars.test(password)) {
    throw new CustomError(
      "Password can only contain letters, numbers, and special characters (#@!*)",
      STATUS_CODE.BAD_REQUEST
    );
  }
};

const validateUsername = (username: string): void => {
  const usernameRegex = /^[A-Za-z0-9._-]+$/;

  if (username.includes(" ")) {
    throw new CustomError(
      "Username cannot contain spaces",
      STATUS_CODE.BAD_REQUEST
    );
  }

  if (!usernameRegex.test(username)) {
    throw new CustomError(
      "Username can only contain letters, numbers, dots, underscores, and hyphens",
      STATUS_CODE.BAD_REQUEST
    );
  }

  if (username.length < 3 || username.length > 30) {
    throw new CustomError(
      "Username must be between 3 and 30 characters",
      STATUS_CODE.BAD_REQUEST
    );
  }
};

const validateFullname = (fullname: string): void => {
  if (fullname.length < 1 || fullname.length > 50) {
    throw new CustomError(
      "Full name must be between 1 and 50 characters",
      STATUS_CODE.BAD_REQUEST
    );
  }
};

const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new CustomError(
      "Invalid email address",
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const validateRegistrationData = (data: {
  email: string;
  username: string;
  password: string;
  fullname: string;
}): void => {
  const { email, fullname, password, username } = data;
  
  // Check for empty fields
  if (!email || !fullname || !password || !username) {
    throw new CustomError(
      "Please fill all fields!",
      STATUS_CODE.BAD_REQUEST
    );
  }

  // Validate all fields
  validateEmail(email);
  validateUsername(username);
  validatePassword(password);
  validateFullname(fullname);
};