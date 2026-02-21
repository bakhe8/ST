import { Response } from "express";

export function ok<T>(
  res: Response,
  data: T,
  status = 200,
  extras?: Record<string, unknown>,
) {
  return res.status(status).json({
    status,
    success: true,
    data,
    ...(extras || {}),
  });
}

export function fail(
  res: Response,
  status: number,
  error: string,
  details?: unknown,
) {
  return res.status(status).json({
    status,
    success: false,
    error,
    ...(typeof details === "undefined" ? {} : { details }),
  });
}
