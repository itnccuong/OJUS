export const formatResponse = (res: any, message: string, status: number) => {
  return res.status(status).json({
    message,
  });
};
