import { Request, Response } from "express";
import { LogsRepository } from "../../src/Logs/logs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../src/user-management/user.repository";

const logsRepository = new LogsRepository();
const userRepository = new UserRepository();

const generateAccessToken = (userId: number, userRole: number) => {
  const accessSecretKey = process.env.ACCESS_SECRET_KEY!;

  const accessTokenPayload = {
    userInfo: {
      userId,
      userRole,
    },
  };

  const accessToken = jwt.sign(accessTokenPayload, accessSecretKey, {
    expiresIn: "5m", // Change this to "15m" for production
  });

  return accessToken;
};
const generateRefreshToken = (userId: number) => {
  const refreshSecretKey = process.env.REFRESH_SECRET_KEY!;

  const refreshTokenPayload = { userId };

  const refreshToken = jwt.sign(refreshTokenPayload, refreshSecretKey, {
    expiresIn: "1h",
  });

  return refreshToken;
};
const verifyRefreshToken = (refreshToken: string) => {
  const refreshSecretKey = process.env.REFRESH_SECRET_KEY!;

  try {
    const decoded = jwt.verify(
      refreshToken,
      refreshSecretKey
    ) as jwt.JwtPayload;
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const loginUserHandler = async (req: Request, res: Response) => {
  if (req.method === "POST" && req.path === "/login") {
    try {
      const { userId, password } = req.body;

      const user = await userRepository.getById(+userId);

      if (!user) {
        return res.status(401).json({ message: "Invalid UserId or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id);

      const createdLog = await logsRepository.create({
        userId,
        refreshToken,
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 24 * 60 * 60 * 1000, // 24 hrs
        secure: true,
        sameSite: "none",
      });

      res
        .status(200)
        .json({ message: "Login successful", userId, accessToken });
    } catch (error) {
      console.error("Error during login:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  if (req.method === "GET" && req.path === "/refresh") {
    try {
      const cookies = req.cookies;

      if (!cookies?.jwt) {
        return res.status(401).json({ message: "No refresh token found" });
      }

      const refreshToken = cookies.jwt;

      let userId;
      try {
        userId = verifyRefreshToken(refreshToken);
      } catch (error) {
        return res.status(401).json({ message: error.message });
      }
      const user = await userRepository.getById(userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const newAccessToken = generateAccessToken(user.id, user.role);

      res.status(200).json({
        message: "Access token refreshed",
        accessToken: newAccessToken,
      });
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
export const logoutUserHandler = async (req: Request, res: Response) => {
  if (req.method === "GET" && req.path === "/logout") {
    try {
      // Extract the refresh token from the cookies
      const cookies = req.cookies;

      if (!cookies?.jwt) {
        return res.status(401).json({ message: "No refresh token found" });
      }
      const refreshToken = cookies.jwt;
      // Remove the refresh token from the logs repository
      await logsRepository.remove({ refreshToken });

      // Clear the refresh token cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        // Enable in production
        secure: true,
        sameSite: "none",
      });

      // Respond with success
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

// TODO add try-catch
export const logoutUserFromAllDevicesHandler = async (
  req: Request,
  res: Response
) => {
  // && req.path === "/logoutalldevices"
  if (req.method === "GET") {
    const parameter = req.query;
    const userId = parameter["uid"];

    // Remove the refresh token from the logs repository
    const result = await logsRepository.removeAll(+userId);
    res.status(200).send("Logged out from " + result.toString() + " Devices");
  } else {
    res.status(405).send("Method not allowed");
  }
};

// TODO check before blacklisting if the user is already blacklisted then respond back with "user already blacklisted".
export const blacklistUserHandler = async (req: Request, res: Response) => {
  if (req.method === "GET" && req.path === "/blacklist") {
    const parameter = req.query;
    const userId = parameter["uid"];

    await logsRepository.removeAll(+userId);
    const result = await logsRepository.blacklist(+userId);

    res
      .status(200)
      .send(`User with userId ${result} has been blacklisted successfully `);
  } else {
    res.status(405).send("Blacklist Method not allowed");
  }
};

export const isUserBlacklistedHandler = async (req: Request, res: Response) => {
  if (req.method === "POST" && req.path === "/login") {
    try {
      const { userId } = req.body;

      // Fetch the user by ID from the database
      const [status] = await logsRepository.getById(+userId);

      if (status.refreshToken === "blacklisted") {
        return res.status(401).json({ message: "User is Blacklisted" });
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

export const unblacklistUserHandler = async (req: Request, res: Response) => {
  if (req.method === "GET" && req.path === "/unblacklist") {
    const parameter = req.query;
    const userId = parameter["uid"];
    // remove the user from the blacklist
    const result = await logsRepository.removeAll(+userId);
    res
      .status(200)
      .send(
        `User with userId ${userId} has been removed from the blacklist successfully`
      );
  } else {
    res.status(405).send("Unblacklist Method not allowed");
  }
};
