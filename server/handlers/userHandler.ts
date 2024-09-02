import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../src/user-management/user.repository";
import bcrypt from "bcrypt";
const userRepository = new UserRepository();

export const createUserHandler = async (req: Request, res: Response) => {
  if (req.method === "POST" && req.path === "/users") {
    try {
      const { password, ...userData } = req.body;
      // Hash the password
      const SALT_ROUNDS = 10;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user with hashed password
      const userWithHashedPassword = { ...userData, password: hashedPassword };

      const createdUser = await userRepository.create(userWithHashedPassword);

      res.status(201).json({
        message: "User added successfully",
        createdUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

export const getAllUserHandler = async (req: Request, res: Response) => {
  const { id, phonenumber, name } = req.query;

  try {
    if (id) {
      const user = await userRepository.getById(Number(id));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else if (phonenumber) {
      const user = await userRepository.getByPhoneNumber(String(phonenumber));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else if (name) {
      const users = await userRepository.getByName(String(name));
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({
        message: "Missing search parameters (id, phonenumber, or name)",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const getUserByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id) {
      const user = await userRepository.getById(Number(id));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "why bro Missing id parameter" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const getUserByPhoneNumberHandler = async (
  req: Request,
  res: Response
) => {
  // TODO make it accept req.query
  const { phonenumber } = req.params;

  try {
    if (phonenumber) {
      const user = await userRepository.getByPhoneNumber(String(phonenumber));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Missing phonenumber parameter" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getUserByNameHandler = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    if (name) {
      const users = await userRepository.getByName(String(name));
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Missing name parameter" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const deleteUserByIdHandler = async (req: Request, res: Response) => {
  const id = req.query.id as string;

  if (req.method === "DELETE" && req.path === "/users") {
    if (id) {
      try {
        const deletedUser = await userRepository.delete(Number(id));
        if (deletedUser) {
          res.status(200).json({
            message: "User deleted successfully",
            deletedUser,
          });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
      }
    } else {
      res.status(400).json({ message: "Missing id parameter" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
