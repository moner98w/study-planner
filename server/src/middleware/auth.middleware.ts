import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    });
  }

  const token = authorization.split(" ")[1];
if (!token) {
  return res.status(401).json({
    success: false,
    message: "Access token is required",
  });
}
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-secret"
    );

    res.locals.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}