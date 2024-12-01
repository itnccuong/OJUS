export const formatResponseNew = (
  res: any,
  name: string,
  message: string,
  status: number,
  data: any,
) => {
  return res.status(status).json({
    name,
    message,
    data,
  });
};
