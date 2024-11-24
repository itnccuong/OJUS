import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";

export interface CustomRequest<T, P extends ParamsDictionary> extends Request {
  body: T;
  params: P;
}

export interface SuccessResponse<T> {
  status: number;
  body: {
    data: T;
  };
}

interface ErrorResponse<T> {
  status: number;
  body: {
    name: string;
    message: string;
    data: T;
  };
}

export interface UserConfig {
  userId: number;
  username: string;
  email: string;
  fullname: string;
  password: string;
}

export interface LoginInterface {
  usernameOrEmail: string;
  password: string;
}

export interface LoginSuccessData {
  token: string;
}

export interface RegisterSuccessData {
  user: UserConfig;
}

export interface RegisterConfig {
  email: string;
  username: string;
  password: string;
  fullname: string;
}

export interface SubmitCodeConfig {
  code: string;
  language: string;
}

export interface SubmitParamsConfig extends ParamsDictionary {
  problem_id: string;
}

export interface ChangePasswordConfig {
  token: string;
  newPassword: string;
}

export interface SendResetLinkConfig {
  email: string;
}
