import { STATUS_CODE } from "./constants";

const formatResponse = (
  res: any,
  data: any,
  status = STATUS_CODE.SUCCESS,
  message = "Success!"
) => {
  return res.status(status).json({
    data,
    status,
    message,
  });
};

export { formatResponse, STATUS_CODE };