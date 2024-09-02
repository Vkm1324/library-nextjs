import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// custom request type that extends Express.Request
export interface CustomRequest extends Request {
  user?: {
    userId: number;
    userRole: number;
  };
}

export const authenticateMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract the access token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  // Load the access secret key
  const accessSecretKey = process.env.ACCESS_SECRET_KEY!;

  try {
    // Verify the access token
    const decoded = jwt.verify(token, accessSecretKey) as jwt.JwtPayload;

    // Attach user information to the request object
    req.user = {
      userId: decoded.userInfo.userId,
      userRole: decoded.userInfo.userRole,
    };

    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(403).json({ message: "Invalid or expired access token" });
  }
};

export const roleBasedAuthorizationMiddleware = (minimumRole: number) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user.userRole < minimumRole) {
        return res.status(403).json({ message: "Access Unathorized" });
      }
      next();
    } catch (error) {
      console.error("Error verifying token:", error.message);
      res.status(403).json({ message: "Invalid or expired access token" });
    }
  };
};
