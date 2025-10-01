import { Response } from 'express';

export interface IResponse<T> {
  status: number;
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  res: Response;
}

export const ResponseService = <T>({
  data,
  status = 200,
  message,
  success,
  error,
  res,
}: IResponse<T>): Response<IResponse<T>> => {
  if (status === 500 && !message) {
    message = 'Internal server error';
  }
  return res.status(status).json({
    data,
    message,
    success,
    ...(error && { error }),
  });
};
