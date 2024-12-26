export const formatResponse = (
  res: any,
  message: string,
  status: number,
  data?: any,
) => {
  return res.status(status).json({
    message,
    data,
  });
};
