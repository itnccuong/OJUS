import { STATUS_CODE } from "./constants";

export const formatResponse = (
  res: any,
  data: any,
  status = STATUS_CODE.SUCCESS,
  message = "Success!",
  stack: string | undefined = undefined,
  errorName: string | null = null,
) => {
  console.warn(
    "Warning: formatResponse is deprecated. Please use successResponse and errorResponse instead.",
  );
  return res.status(status).json({
    data,
    status,
    message,
    stack,
    errorName,
  });
};

export const successResponse = (res: any, data: any) => {
  return res.status(STATUS_CODE.SUCCESS).json({
    data,
  });
};

export const errorResponse = (
  res: any,
  name: string,
  message: string,
  status: number,
  data: any,
) => {
  return res.status(status).json({
    name,
    message,
    status,
    data,
  });
};
