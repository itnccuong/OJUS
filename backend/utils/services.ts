import { STATUS_CODE } from "./constants";

const formatResponse = (
  res: any,
  data: any,
  status = STATUS_CODE.SUCCESS,
  message = "Success!",
  errorName: string | null = null,
) => {
  return res.status(status).json({
    data,
    status,
    message,
    errorName,
  });
};

export { formatResponse, STATUS_CODE };
