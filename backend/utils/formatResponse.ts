import { STATUS_CODE } from "./constants";

const formatResponse = (
  res: any,
  data: any,
  status = STATUS_CODE.SUCCESS,
  message = "Success!",
  stack: string | undefined = undefined,
  errorName: string | null = null,
) => {
  return res.status(status).json({
    data,
    status,
    message,
    stack,
    errorName,
  });
};

export { formatResponse };
